import { S3Handler } from 'aws-lambda';
import AWS from 'aws-sdk';
import csvParser from 'csv-parser';
import crypto from 'crypto';

import { getEnvVar } from '@libs/common';

const importFileParser: S3Handler = async (event) => {
  console.log(`importFileParser - event.Records: ${JSON.stringify(event.Records)}`);

  const s3 = new AWS.S3({ region: getEnvVar('AWS_GENERAL_REGION') });
  const sqs = new AWS.SQS();

  for (const record of event.Records) {
    const s3OriginFileParams = {
      Bucket: getEnvVar('IMPORT_SERVICE_BUCKET'),
      Key: record.s3.object.key,
    };

    const originFileStream = s3.getObject(s3OriginFileParams).createReadStream();
    const csvStream = originFileStream.pipe(csvParser());

    const groupId = crypto.randomUUID();

    for await (const jsonLine of csvStream) {
      const message = { meta: {}, availableProduct: jsonLine };

      await sqs
        .sendMessage({
          QueueUrl: getEnvVar('SQS_URL'),
          MessageGroupId: groupId,
          MessageDeduplicationId: crypto.randomUUID(),
          MessageBody: JSON.stringify(message),
        })
        .promise();

      console.log(`importFileParser - SQS message ${JSON.stringify(message)} was sent`);
    }

    await sqs
      .sendMessage({
        QueueUrl: getEnvVar('SQS_URL'),
        MessageGroupId: groupId,
        MessageDeduplicationId: crypto.randomUUID(),
        MessageBody: JSON.stringify({ meta: { isFinished: true }, availableProduct: {} }),
      })
      .promise();
    console.log(`importFileParser - SQS 'close' message was sent`);

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
