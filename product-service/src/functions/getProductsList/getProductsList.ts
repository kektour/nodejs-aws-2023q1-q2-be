import { getProducts } from '../../dataStorage';
import { createResponse } from '../../utils';

const handler = async () => {
  const products = await getProducts();

  return createResponse(200, products);
};

export default handler;
