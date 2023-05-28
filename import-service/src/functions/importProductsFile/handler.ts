import AWS from 'aws-sdk';
import middy from '@middy/core';
import cors from '@middy/http-cors';

import type { ValidatedEventAPIGatewayProxyGetEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { getEnvVar } from '@libs/common';

import schema from './schema';

const importProductsFile: ValidatedEventAPIGatewayProxyGetEvent<typeof schema> = async (event) => {
  console.log(`importProductsFile - queryStringParameters: ${JSON.stringify(event.queryStringParameters)}`);

  const bucketFileName = event.queryStringParameters?.name;
  if (!bucketFileName) {
    return formatJSONResponse({ message: 'Missed required "name" query param' }, 400);
  }

  const s3 = new AWS.S3({ region: getEnvVar('AWS_GENERAL_REGION') });

  const bucketFolder = 'uploaded';
  const bucketKey = `${bucketFolder}/${bucketFileName}`;

  const uploadUrl = await s3.getSignedUrlPromise('putObject', {
    Bucket: getEnvVar('IMPORT_SERVICE_BUCKET'),
    Key: bucketKey,
    ContentType: 'application/csv',
    Expires: 300,
  });

  return formatJSONResponse({ uploadUrl });
};

export const main = middy(importProductsFile).use(cors());
