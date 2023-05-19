import { APIGatewayAuthorizerHandler } from 'aws-lambda';
import { Effect, generatePolicy } from '@libs/generatePolicy';

const basicAuthorizer: APIGatewayAuthorizerHandler = async (event) => {
  console.log('basicAuthorizer event: ', event);

  const {
    methodArn,
    // @ts-expect-error
    headers: { Authorization },
  } = event;

  if (!Authorization) {
    throw new Error('Unauthorized');
  }

  const [, encodedCreds] = Authorization.split(' ');
  const buff = Buffer.from(encodedCreds, 'base64');
  const [username, password] = buff.toString('utf-8').split(':');

  console.log(`Username: ${username} and password: ${password}`);

  const storedUserPassword = process.env[username];
  const effect = !storedUserPassword || storedUserPassword !== password ? Effect.Deny : Effect.Allow;

  return generatePolicy(encodedCreds, methodArn, effect);
};

export const main = basicAuthorizer;
