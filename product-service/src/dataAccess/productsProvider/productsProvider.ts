export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
}

export interface AvailableProduct extends Product {
  count: number;
}

export interface Stock {
  id: string;
  count: number;
  product_id: string;
}

export interface ProductsProvider {
  getAll(): Promise<Array<Product>>;
  getAllWithCount(): Promise<Array<AvailableProduct>>;
  getById(id: string): Promise<AvailableProduct | null>;
  create(title: string, description: string, price: number, count: number): Promise<AvailableProduct>;
}
