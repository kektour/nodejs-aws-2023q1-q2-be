import { DynamoDB } from 'aws-sdk';
import { EnvService } from '../../services/envService';
import { Stock, StocksProvider } from './stocksProvider';

export class StocksProviderImpl implements StocksProvider {
  private readonly _dynamo = new DynamoDB.DocumentClient();

  constructor(private readonly _envService: EnvService) {}

  public async getAll(): Promise<Array<Stock>> {
    const stocksResult = await this._dynamo.scan({ TableName: this._envService.getVar('DB_STOCKS_TABLE') }).promise();
    return stocksResult.Items as Array<Stock>;
  }
}
