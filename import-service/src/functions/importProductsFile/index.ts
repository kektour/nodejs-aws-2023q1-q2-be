import { handlerPath } from '@libs/common';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
        authorizer: {
          type: 'request',
          arn: 'arn:aws:lambda:us-east-1:466226802026:function:authorization-service-dev-basicAuthorizer',
        },
      },
    },
  ],
};
