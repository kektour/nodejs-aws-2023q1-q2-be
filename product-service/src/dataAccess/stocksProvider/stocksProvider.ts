export interface Stock {
  id: string;
  count: number;
  product_id: string;
}

export interface StocksProvider {
  getAll(): Promise<Array<Stock>>;
}
