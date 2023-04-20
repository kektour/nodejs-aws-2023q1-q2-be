import AWS from 'aws-sdk';
import { AvailableProduct, ProductsProvider, ProductsProviderImpl, ProductsProviderMockImpl } from '../../dataAccess';
import { EnvService, EnvServiceImpl } from '../../services/envService';
import { SQSBody } from './types';

let availableProductPromises: Array<Promise<AvailableProduct>> = [];
let isFinished = false;

const handler = async (event: any) => {
  console.log(`catalogBatchProcess - event.Records: ${JSON.stringify(event.Records)}`);

  const envService: EnvService = new EnvServiceImpl();

  const productsProvider: ProductsProvider = new ProductsProviderImpl(envService);
  // const productsProvider: ProductsProvider = new ProductsProviderMockImpl();

  event.Records.forEach((record: any) => {
    const { availableProduct, meta }: SQSBody = JSON.parse(record.body);
    if (meta.isFinished) {
      isFinished = true;
      return;
    }

    availableProductPromises.push(
      productsProvider.create(availableProduct.title, availableProduct.description, availableProduct.price, availableProduct.count)
    );
  });

  if (!isFinished) return;

  const sns = new AWS.SNS();
  const availableProducts = await Promise.all(availableProductPromises);
  console.log(`catalogBatchProcess - Uploaded ${availableProducts.length} available products`);

  availableProductPromises = [];
  isFinished = false;

  await sns
    .publish({
      Subject: 'Products uploaded',
      Message: JSON.stringify(availableProducts),
      TopicArn: envService.getVar('SNS_ARN'),
    })
    .promise();

  console.log('catalogBatchProcess - Email was sent');
};

export default handler;
