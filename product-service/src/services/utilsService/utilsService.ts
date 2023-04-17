import { ValidationError } from 'yup';

export interface Response {
  statusCode: number;
  body: string;
  headers: Record<string, any>;
}

export interface UtilsService {
  createResponse(statusCode: number, data: Record<string, any>): Response;
  transformYupErrorsToObject(topLevelError: ValidationError): Record<string, string>;
}
