import { AvailableProduct } from '../../dataAccess';

export interface SQSBody {
  availableProduct: AvailableProduct;
  meta: {
    isFinished?: boolean;
  };
}
