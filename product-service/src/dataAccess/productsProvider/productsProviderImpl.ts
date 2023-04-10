import { DynamoDB } from 'aws-sdk';
import { EnvService } from '../../services/envService';
import { StocksProvider, Stock } from '../stocksProvider';
import { AvailableProduct, Product, ProductsProvider } from './productsProvider';

export class ProductsProviderImpl implements ProductsProvider {
  private readonly _dynamo = new DynamoDB.DocumentClient();

  constructor(private readonly _envService: EnvService, private readonly _stocksProvider: StocksProvider) {}

  public async getAll(): Promise<Array<Product>> {
    const productsResult = await this._dynamo.scan({ TableName: this._envService.getVar('DB_PRODUCTS_TABLE') }).promise();
    return productsResult.Items as Array<Product>;
  }

  public async getAllWithCount(): Promise<Array<AvailableProduct>> {
    const [productsResult, stocks] = await Promise.all([
      this._dynamo.scan({ TableName: this._envService.getVar('DB_PRODUCTS_TABLE') }).promise(),
      this._stocksProvider.getAll(),
    ]);

    const products = productsResult.Items as Array<Product>;

    return this._combineProductsWithStocks(products, stocks);
  }

  public async getById(id: string): Promise<AvailableProduct | null> {
    const productsResult = await this._dynamo
      .query({ TableName: this._envService.getVar('DB_PRODUCTS_TABLE'), KeyConditionExpression: 'id = :id', ExpressionAttributeValues: { ':id': id } })
      .promise();

    const products = productsResult.Items as Array<Product>;

    if (!products.length) {
      return null;
    }

    const stocks = await this._stocksProvider.getAll();

    const [combinedProductWithStock] = this._combineProductsWithStocks(products, stocks);
    return combinedProductWithStock;
  }

  public create(title: string, description: string, price: number, count: number): Promise<AvailableProduct> {
    throw new Error('Method not implemented.');
  }

  private _combineProductsWithStocks(products: Array<Product>, stocks: Array<Stock>): Array<AvailableProduct> {
    const stocksMap = stocks.reduce<Record<string, Stock>>(
      (obj, stock) => ({
        ...obj,
        [stock.product_id]: stock,
      }),
      {}
    );

    return products.map<AvailableProduct>((product) => ({
      ...product,
      count: stocksMap[product.id].count,
    }));
  }
}
