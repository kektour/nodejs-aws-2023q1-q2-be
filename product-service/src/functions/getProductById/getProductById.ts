import { ProductsProvider, ProductsProviderImpl } from '../../dataAccess/productsProvider';
import { EnvService, EnvServiceImpl } from '../../services/envService';
import { UtilsService, UtilsServiceImpl } from '../../services/utilsService';
import { GetApiEvent } from '../../types';

const handler = async (event: GetApiEvent) => {
  console.info(`Function: getProductById - PathParameters: ${JSON.stringify(event.pathParameters)}`);

  const { id } = event.pathParameters;

  const utilsService: UtilsService = new UtilsServiceImpl();
  const envService: EnvService = new EnvServiceImpl();

  const productsProvider: ProductsProvider = new ProductsProviderImpl(envService);

  try {
    const product = await productsProvider.getById(id);

    if (!product) {
      return utilsService.createResponse(404, {
        data: null,
        error: { message: 'Product not found' },
      });
    }

    return utilsService.createResponse(200, { data: product });
  } catch (err) {
    console.error(`Function: getProductById - Error: ${err}`);

    return utilsService.createResponse(500, {
      error: { message: 'Internal server error' },
    });
  }
};

export default handler;
