import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewateProxyGetEvent<S> = Omit<APIGatewayProxyEvent, 'queryStringParameters'> & { queryStringParameters: FromSchema<S> | null };
export type ValidatedEventAPIGatewayProxyGetEvent<S> = Handler<ValidatedAPIGatewateProxyGetEvent<S>, APIGatewayProxyResult>;

export const formatJSONResponse = (response: Record<string, any>, statusCode = 200, headers: Record<string, any> = {}) => {
  return {
    statusCode,
    body: JSON.stringify(response),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      ...headers,
    },
  };
};
