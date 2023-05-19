import { DynamoDB } from 'aws-sdk';
import crypto from 'crypto';
import { EnvService } from '../services/envService';
import { AvailableProduct, Product, ProductsProvider, Stock } from './productsProvider';

export class ProductsProviderImpl implements ProductsProvider {
  private readonly _dynamoClient = new DynamoDB.DocumentClient();

  constructor(private readonly _envService: EnvService) {}

  public async getAll(): Promise<Array<Product>> {
    const productsResult = await this._dynamoClient.scan({ TableName: this._envService.getVar('DB_PRODUCTS_TABLE') }).promise();
    return productsResult.Items as Array<Product>;
  }

  public async getAllWithCount(): Promise<Array<AvailableProduct>> {
    const [productsResult, stocksResult] = await Promise.all([
      this._dynamoClient.scan({ TableName: this._envService.getVar('DB_PRODUCTS_TABLE') }).promise(),
      this._dynamoClient.scan({ TableName: this._envService.getVar('DB_STOCKS_TABLE') }).promise(),
    ]);

    const products = productsResult.Items as Array<Product>;
    const stocks = stocksResult.Items as Array<Stock>;

    return this._combineProductsWithStocks(products, stocks);
  }

  public async getById(id: string): Promise<AvailableProduct | null> {
    const productsResult = await this._dynamoClient
      .query({ TableName: this._envService.getVar('DB_PRODUCTS_TABLE'), KeyConditionExpression: 'id = :id', ExpressionAttributeValues: { ':id': id } })
      .promise();

    const products = productsResult.Items as Array<Product>;

    if (!products.length) {
      return null;
    }

    const stocksResult = await this._dynamoClient.scan({ TableName: this._envService.getVar('DB_STOCKS_TABLE') }).promise();
    const stocks = stocksResult.Items as Array<Stock>;

    const [combinedProductWithStock] = this._combineProductsWithStocks(products, stocks);
    return combinedProductWithStock;
  }

  public async create(title: string, description: string, price: number, count: number): Promise<AvailableProduct> {
    const productId = crypto.randomUUID();
    const stockId = crypto.randomUUID();

    await this._dynamoClient
      .transactWrite({
        TransactItems: [
          {
            Put: {
              TableName: this._envService.getVar('DB_PRODUCTS_TABLE'),
              Item: {
                id: productId,
                title,
                description,
                price,
              },
            },
          },
          {
            Put: {
              TableName: this._envService.getVar('DB_STOCKS_TABLE'),
              Item: {
                id: stockId,
                product_id: productId,
                count,
              },
            },
          },
        ],
      })
      .promise();

    const [productsResult, stocksResult] = await Promise.all([
      this._dynamoClient
        .query({ TableName: this._envService.getVar('DB_PRODUCTS_TABLE'), KeyConditionExpression: 'id = :id', ExpressionAttributeValues: { ':id': productId } })
        .promise(),
      this._dynamoClient.scan({ TableName: this._envService.getVar('DB_STOCKS_TABLE') }).promise(),
    ]);

    const products = productsResult.Items as Array<Product>;
    const stocks = stocksResult.Items as Array<Stock>;

    const [combinedProductWithStock] = this._combineProductsWithStocks(products, stocks);
    return combinedProductWithStock;
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
