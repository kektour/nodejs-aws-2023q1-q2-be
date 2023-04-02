import { getAvailableProducts } from '../../dataStorage';
import { createResponse } from '../../utils';

const handler = async () => {
  const availableProducts = await getAvailableProducts();

  return createResponse(200, availableProducts);
};

export default handler;
