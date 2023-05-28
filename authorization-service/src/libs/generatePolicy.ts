import { PolicyDocument } from 'aws-lambda';

export enum Effect {
  Allow = 'Allow',
  Deny = 'Deny',
}

interface Policy {
  principalId: string;
  policyDocument: PolicyDocument;
}

export const generatePolicy = (principalId: string, resource: string, effect: Effect = Effect.Deny): Policy => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});
