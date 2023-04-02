import { getProductById } from '../../dataStorage';
import { ApiEvent } from '../../types';
import { createResponse } from '../../utils';

const handler = async (event: ApiEvent) => {
  const { id } = event.pathParameters;

  const product = await getProductById(id);

  if (!product) {
    return createResponse(404, {
      data: null,
      error: {
        message: 'Product not found',
      },
    });
  }

  return createResponse(200, { data: product });
};

export default handler;
