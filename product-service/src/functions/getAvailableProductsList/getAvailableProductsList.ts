import { ProductsProvider, ProductsProviderImpl } from '../../dataAccess/productsProvider';
import { EnvService, EnvServiceImpl } from '../../services/envService';
import { UtilsService, UtilsServiceImpl } from '../../services/utilsService';

const handler = async () => {
  console.info('Function: getAvailableProductsList');

  const utilsService: UtilsService = new UtilsServiceImpl();
  const envService: EnvService = new EnvServiceImpl();

  const productsProvider: ProductsProvider = new ProductsProviderImpl(envService);

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
