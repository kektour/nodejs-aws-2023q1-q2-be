import { ProductsProvider, ProductsProviderImpl, ProductsProviderMockImpl } from '../../dataAccess';
import { EnvService, EnvServiceImpl } from '../../services/envService';
import { UtilsService, UtilsServiceImpl } from '../../services/utilsService';

const handler = async () => {
  console.info('Function: getAvailableProductsList');

  const utilsService: UtilsService = new UtilsServiceImpl();
  const envService: EnvService = new EnvServiceImpl();

  const productsProvider: ProductsProvider = new ProductsProviderImpl(envService);
  // const productsProvider: ProductsProvider = new ProductsProviderMockImpl();

  try {
    const availableProducts = await productsProvider.getAllWithCount();
    return utilsService.createResponse(200, availableProducts);
  } catch (err) {
    console.error(`Function: getAvailableProductsList - Error: ${err}`);
    
    return utilsService.createResponse(500, {
      error: { message: 'Internal server error' },
    });
  }
};

export default handler;
