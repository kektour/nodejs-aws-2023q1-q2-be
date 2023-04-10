import { ProductsProvider, ProductsProviderImpl } from '../../dataAccess/productsProvider';
import { StocksProvider, StocksProviderImpl } from '../../dataAccess/stocksProvider';
import { EnvService, EnvServiceImpl } from '../../services/envService';
import { UtilsService, UtilsServiceImpl } from '../../services/utilsService';

const handler = async () => {
  const utilsService: UtilsService = new UtilsServiceImpl();
  const envService: EnvService = new EnvServiceImpl();

  const stocksProvider: StocksProvider = new StocksProviderImpl(envService);
  const productsProvider: ProductsProvider = new ProductsProviderImpl(envService, stocksProvider);

  const products = await productsProvider.getAll();

  return utilsService.createResponse(200, products);
};

export default handler;
