import { UtilsService, UtilsServiceImpl } from '../../services/utilsService';
import { PostApiEvent } from '../../types';
import { validationSchema } from './validationSchema';
import { NewProduct } from './types';
import { ValidationError } from 'yup';
import { EnvService, EnvServiceImpl } from '../../services/envService';
import { ProductsProvider, ProductsProviderImpl } from '../../dataAccess/productsProvider';

const handler = async (event: PostApiEvent) => {
  console.info(`Function: createProduct - Body: ${event.body}`);

  const utilsService: UtilsService = new UtilsServiceImpl();
  const envService: EnvService = new EnvServiceImpl();

  const productsProvider: ProductsProvider = new ProductsProviderImpl(envService);

  let body: Record<string, any>;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    console.error(`Function: createProduct - Error: ${err}`);

    return utilsService.createResponse(500, {
      error: { message: 'Internal server error' },
    });
  }

  try {
    await validationSchema.validate(body, { abortEarly: false });
  } catch (err) {
    if (!(err instanceof ValidationError)) {
      console.error(`Function: createProduct- Error: ${err}`);

      return utilsService.createResponse(500, {
        error: { message: 'Internal server error' },
      });
    }

    const errors = utilsService.transformYupErrorsToObject(err);
    console.error(`Function: createProduct - Reason: Body Validation - Error: ${errors}`);

    return utilsService.createResponse(400, {
      data: null,
      errors,
    });
  }

  const { title, description, price, count } = body as NewProduct;
  const newProduct = await productsProvider.create(title, description, price, count);

  return utilsService.createResponse(200, newProduct);
};

export default handler;
