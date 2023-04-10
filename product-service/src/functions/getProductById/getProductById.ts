import { ProductsProvider, ProductsProviderImpl } from '../../dataAccess/productsProvider';
import { StocksProvider, StocksProviderImpl } from '../../dataAccess/stocksProvider';
import { EnvService, EnvServiceImpl } from '../../services/envService';
import { UtilsService, UtilsServiceImpl } from '../../services/utilsService';
import { GetApiEvent } from '../../types';

const handler = async (event: GetApiEvent) => {
  const { id } = event.pathParameters;

  const utilsService: UtilsService = new UtilsServiceImpl();
  const envService: EnvService = new EnvServiceImpl();

  const stocksProvider: StocksProvider = new StocksProviderImpl(envService);
  const productsProvider: ProductsProvider = new ProductsProviderImpl(envService, stocksProvider);

  const product = await productsProvider.getById(id);

  if (!product) {
    return utilsService.createResponse(404, {
      data: null,
      error: {
        message: 'Product not found',
      },
    });
  }

  return utilsService.createResponse(200, { data: product });
};

export default handler;
