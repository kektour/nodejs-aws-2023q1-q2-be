import crypto from 'crypto';
import { AvailableProduct, Product, ProductsProvider } from './productsProvider';

export class ProductsProviderMockImpl implements ProductsProvider {
  private _availableProducts: Array<AvailableProduct> = [
    { id: '1', title: 'title 1', description: 'description 1', count: 10, price: 10 },
    { id: '2', title: 'title 2', description: 'description 2', count: 20, price: 20 },
    { id: '3', title: 'title 3', description: 'description 3', count: 30, price: 30 },
    { id: '4', title: 'title 4', description: 'description 4', count: 40, price: 40 },
    { id: '5', title: 'title 5', description: 'description 5', count: 50, price: 50 },
  ];

  public getAll(): Promise<Array<Product>> {
    return Promise.resolve(this._availableProducts.map(({ count, ...product }) => product));
  }

  public getAllWithCount(): Promise<Array<AvailableProduct>> {
    return Promise.resolve(this._availableProducts);
  }

  public getById(id: string): Promise<AvailableProduct | null> {
    const found = this._availableProducts.find((availableProduct) => availableProduct.id === id);

    if (!found) {
      return Promise.resolve(null);
    }

    return Promise.resolve(found);
  }

  public create(title: string, description: string, price: number, count: number): Promise<AvailableProduct> {
    const newAvailableProduct = {
      id: crypto.randomUUID(),
      title,
      description,
      price,
      count,
    };

    this._availableProducts.push(newAvailableProduct);

    return Promise.resolve({ ...newAvailableProduct });
  }
}
