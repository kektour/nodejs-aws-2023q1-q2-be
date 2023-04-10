import { ValidationError } from 'yup';
import { UtilsService, Response } from './utilsService';

export class UtilsServiceImpl implements UtilsService {
  public createResponse(statusCode: number, data: Record<string, any>): Response {
    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(data),
    };
  }

  public transformYupErrorsToObject(topLevelError: ValidationError): Record<string, string> {
    const errors: Record<string, string> = {};

    if (topLevelError.inner.length) {
      topLevelError.inner.forEach((error) => {
        if (!errors[error.path!]) {
          errors[error.path!] = error.message;
        }
      });
    } else {
      errors[topLevelError.path!] = topLevelError.message;
    }

    return errors;
  }
}
