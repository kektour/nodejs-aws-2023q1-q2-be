import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';

import { ProductsProviderImpl } from '../../dataAccess';
import { AvailableProduct } from '../../dataAccess';
import catalogBatchProcess from './catalogBatchProcess';

describe('catalogBatchProcess', () => {
  const SNS_ARN = 'SNS_ARN';

  const availableProductsFromSQS = [
    { title: 'title 1', description: 'description 1', count: 10, price: 10 },
    { title: 'title 2', description: 'description 2', count: 20, price: 20 },
    { title: 'title 3', description: 'description 3', count: 30, price: 30 },
    { title: 'title 4', description: 'description 4', count: 40, price: 40 },
    { title: 'title 5', description: 'description 5', count: 50, price: 50 },
  ];

  const expectedAvailableProducts: Array<AvailableProduct> = [
    { id: '1', ...availableProductsFromSQS[0] },
    { id: '2', ...availableProductsFromSQS[1] },
    { id: '3', ...availableProductsFromSQS[2] },
    { id: '4', ...availableProductsFromSQS[3] },
    { id: '5', ...availableProductsFromSQS[4] },
  ];

  const event = {
    Records: [
      {
        body: JSON.stringify({
          availableProduct: availableProductsFromSQS[0],
          meta: {},
        }),
      },
      {
        body: JSON.stringify({
          availableProduct: availableProductsFromSQS[1],
          meta: {},
        }),
      },
      {
        body: JSON.stringify({
          availableProduct: availableProductsFromSQS[2],
          meta: {},
        }),
      },
      {
        body: JSON.stringify({
          availableProduct: availableProductsFromSQS[3],
          meta: {},
        }),
      },
      {
        body: JSON.stringify({
          availableProduct: availableProductsFromSQS[4],
          meta: {},
        }),
      },
      {
        body: JSON.stringify({ availableProduct: {}, meta: { isFinished: true } }),
      },
    ],
  };

  beforeAll(() => {
    process.env['SNS_ARN'] = SNS_ARN;
  });

  afterAll(() => {
    delete process.env['SNS_ARN'];
  });

  it('should upload available products and notify via SNS', async () => {
    const productsProviderImplCreateFnSpy = jest
      .spyOn(ProductsProviderImpl.prototype, 'create')
      .mockResolvedValueOnce(expectedAvailableProducts[0])
      .mockResolvedValueOnce(expectedAvailableProducts[1])
      .mockResolvedValueOnce(expectedAvailableProducts[2])
      .mockResolvedValueOnce(expectedAvailableProducts[3])
      .mockResolvedValueOnce(expectedAvailableProducts[4]);

    AWSMock.setSDKInstance(AWS);
    const snsPromiseMock = jest.fn().mockResolvedValueOnce(null);
    const snsPublishMock = jest.fn().mockReturnValue({ promise: snsPromiseMock });
    AWSMock.mock('SNS', 'publish', snsPublishMock);

    await catalogBatchProcess(event);

    expect(productsProviderImplCreateFnSpy).toHaveBeenCalledWith(
      availableProductsFromSQS[0].title,
      availableProductsFromSQS[0].description,
      availableProductsFromSQS[0].price,
      availableProductsFromSQS[0].count
    );
    expect(productsProviderImplCreateFnSpy).toHaveBeenCalledWith(
      availableProductsFromSQS[1].title,
      availableProductsFromSQS[1].description,
      availableProductsFromSQS[1].price,
      availableProductsFromSQS[1].count
    );
    expect(productsProviderImplCreateFnSpy).toHaveBeenCalledWith(
      availableProductsFromSQS[2].title,
      availableProductsFromSQS[2].description,
      availableProductsFromSQS[2].price,
      availableProductsFromSQS[2].count
    );
    expect(productsProviderImplCreateFnSpy).toHaveBeenCalledWith(
      availableProductsFromSQS[3].title,
      availableProductsFromSQS[3].description,
      availableProductsFromSQS[3].price,
      availableProductsFromSQS[3].count
    );
    expect(productsProviderImplCreateFnSpy).toHaveBeenCalledWith(
      availableProductsFromSQS[4].title,
      availableProductsFromSQS[4].description,
      availableProductsFromSQS[4].price,
      availableProductsFromSQS[4].count
    );

    // expect(snsPromiseMock).toHaveBeenCalled();
    expect(snsPublishMock.mock.lastCall[0]).toEqual({
      Subject: 'Products uploaded',
      Message: JSON.stringify(expectedAvailableProducts),
      TopicArn: SNS_ARN,
    });

    AWSMock.restore('SNS');
  });
});
