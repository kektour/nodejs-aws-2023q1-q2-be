import { S3Handler } from 'aws-lambda';
import AWS from 'aws-sdk';
import csvParser from 'csv-parser';

import { getEnvVar } from '@libs/common';

const importFileParser: S3Handler = async (event) => {
  console.log(`importFileParser - event.Records: ${JSON.stringify(event.Records)}`);

  const s3 = new AWS.S3({ region: getEnvVar('AWS_GENERAL_REGION') });

  for (const record of event.Records) {
    const s3OriginFileParams = {
      Bucket: getEnvVar('IMPORT_SERVICE_BUCKET'),
      Key: record.s3.object.key,
    };

    const originFileStream = s3.getObject(s3OriginFileParams).createReadStream();
    const csvStream = originFileStream.pipe(csvParser());

    for await (const jsonLine of csvStream) {
      console.log(`importFileParser - file: ${JSON.stringify(s3OriginFileParams)} - line: ${JSON.stringify(jsonLine)}`);
    }

    await s3
      .copyObject({
        CopySource: s3OriginFileParams.Bucket + '/' + s3OriginFileParams.Key,
        Bucket: s3OriginFileParams.Bucket,
        Key: s3OriginFileParams.Key.replace('uploaded', 'parsed'),
      })
      .promise();

    await s3.deleteObject(s3OriginFileParams).promise();
  }
};

export const main = importFileParser;
