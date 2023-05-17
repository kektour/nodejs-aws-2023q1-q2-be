import { handlerPath } from '@libs/common';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: '${self:custom.environment.IMPORT_SERVICE_BUCKET}',
        event: 's3:ObjectCreated:*',
        rules: [{ prefix: 'uploaded/' }],
        existing: true,
      },
    },
  ],
};
