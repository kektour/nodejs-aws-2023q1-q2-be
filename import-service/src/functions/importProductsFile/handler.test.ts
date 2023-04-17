import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';

import * as apiGateway from '@libs/apiGateway';

import { main } from './handler';

describe('importProductsFile handler', () => {
  const AWS_GENERAL_REGION = 'AWS_GENERAL_REGION';
  const IMPORT_SERVICE_BUCKET = 'IMPORT_SERVICE_BUCKET';

  const defaultHeaders = {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*',
  };

  beforeAll(() => {
    process.env['AWS_GENERAL_REGION'] = AWS_GENERAL_REGION;
    process.env['IMPORT_SERVICE_BUCKET'] = IMPORT_SERVICE_BUCKET;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return error if no "name" query param', async () => {
    const formatJSONResponseSpy = jest.spyOn(apiGateway, 'formatJSONResponse');
    const res = await main({ queryStringParameters: null } as any, {} as any, {} as any);

    expect(res).toEqual({
      statusCode: 400,
      body: JSON.stringify({ message: 'Missed required "name" query param' }),
      headers: defaultHeaders,
    });

    expect(formatJSONResponseSpy).toHaveBeenCalledWith({ message: 'Missed required "name" query param' }, 400);
  });

  it('should handle event', async () => {
    const fileName = 'foo.csv';
    const fakeUploadUrl = 'https://upload.url';
    const expectedBody = { uploadUrl: fakeUploadUrl };

    AWSMock.setSDKInstance(AWS);
    const getSignedUrlPromiseMock = jest.fn().mockResolvedValue(fakeUploadUrl);
    AWSMock.mock('S3', 'getSignedUrlPromise', getSignedUrlPromiseMock);

    const formatJSONResponseSpy = jest.spyOn(apiGateway, 'formatJSONResponse');

    const res = await main({ queryStringParameters: { name: fileName } } as any, {} as any, {} as any);

    expect(res).toEqual({ statusCode: 200, body: JSON.stringify(expectedBody), headers: defaultHeaders });

    expect(getSignedUrlPromiseMock).toHaveBeenCalledWith(
      'putObject',
      {
        Bucket: IMPORT_SERVICE_BUCKET,
        Key: `uploaded/${fileName}`,
        ContentType: 'application/csv',
        Expires: 300,
      },
    );

    expect(formatJSONResponseSpy).toHaveBeenCalledWith(expectedBody);

    AWSMock.restore('S3');
  });

  afterAll(() => {
    delete process.env['AWS_GENERAL_REGION'];
    delete process.env['IMPORT_SERVICE_BUCKET'];
  });
});
