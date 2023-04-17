import { ProductsProvider, ProductsProviderImpl } from '../../dataAccess/productsProvider';
import { EnvService, EnvServiceImpl } from '../../services/envService';
import { UtilsService, UtilsServiceImpl } from '../../services/utilsService';

const handler = async () => {
  console.info('Function: getProductsList');

  const utilsService: UtilsService = new UtilsServiceImpl();
  const envService: EnvService = new EnvServiceImpl();
  const productsProvider: ProductsProvider = new ProductsProviderImpl(envService);

  try {
    const products = await productsProvider.getAll();
    return utilsService.createResponse(200, products);
  } catch (err) {
    console.error(`Function: getProductsList - Error: ${err}`);

    return utilsService.createResponse(500, {
      error: { message: 'Internal server error' },
    });
  }
};

export default handler;
