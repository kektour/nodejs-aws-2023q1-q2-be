// import * as dataStorage from '../../dataStorage';
// import { AvailableProduct } from '../../types';
// import * as utils from '../../utils';
// import getProductById from './getProductById';

describe('getProductById', () => {
  it('', () => {});
  //   it('should return product by id', async () => {
  //     const id = '1';
  //     const expectedDataFromStorage = (await dataStorage.getProductById(id)) as AvailableProduct;
  //     const expectedResponse = utils.createResponse(200, { data: expectedDataFromStorage });

  //     const spyGetAvailableProducts = jest.spyOn(dataStorage, 'getProductById');
  //     const spyCreateResponse = jest.spyOn(utils, 'createResponse');

  //     const response = await getProductById({ pathParameters: { id } });

  //     expect(response).toEqual(expectedResponse);

  //     expect(spyGetAvailableProducts).toHaveBeenCalled();
  //     expect(spyCreateResponse).toHaveBeenCalledWith(200, { data: expectedDataFromStorage });
  //   });

  //   it('should return error', async () => {
  //     const id = '12';
  //     const expectedResponse = utils.createResponse(404, {
  //       data: null,
  //       error: {
  //         message: 'Product not found',
  //       },
  //     });

  //     const spyGetAvailableProducts = jest.spyOn(dataStorage, 'getProductById');
  //     const spyCreateResponse = jest.spyOn(utils, 'createResponse');

  //     const response = await getProductById({ pathParameters: { id } });

  //     expect(response).toEqual(expectedResponse);

  //     expect(spyGetAvailableProducts).toHaveBeenCalled();
  //     expect(spyCreateResponse).toHaveBeenCalledWith(404, {
  //       data: null,
  //       error: {
  //         message: 'Product not found',
  //       },
  //     });
  //   });
});
