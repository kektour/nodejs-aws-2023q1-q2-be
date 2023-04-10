import { UtilsService, UtilsServiceImpl } from '../../services/utilsService';
import { PostApiEvent } from '../../types';
import { validationSchema } from './validationSchema';
import { NewProduct } from './types';
import { ValidationError } from 'yup';

const handler = async (event: PostApiEvent) => {
  console.info(`Function: createProduct - Body: ${event.body}`);
  const utilsService: UtilsService = new UtilsServiceImpl();

  try {
    const body = JSON.parse(event.body);

    try {
      await validationSchema.validate(body, { abortEarly: false });
    } catch (err) {
      if (!(err instanceof ValidationError)) {
        return utilsService.createResponse(500, { err: 'Unhandled error' });
      }

      const errors = utilsService.transformYupErrorsToObject(err);
      return utilsService.createResponse(400, errors);
    }

    const { title, description, price, count } = <NewProduct>body;
    // const newProduct = 
    return utilsService.createResponse(200, newProduct);
  } catch (err) {
    console.error(err);
    return utilsService.createResponse(500, { err: 'Unhandled error' });
  }
};

export default handler;
