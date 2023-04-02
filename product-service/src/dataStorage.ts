import { AvailableProduct, Product } from './types';
import { getRandomNumber } from './utils';

const availableProducts: Array<AvailableProduct> = [
  { id: '1', title: 'Book 1', description: 'Description 1', price: 49, count: getRandomNumber(0, 100) },
  { id: '2', title: 'Book 2', description: 'Description 2', price: 28, count: getRandomNumber(0, 100) },
  { id: '3', title: 'Book 3', description: 'Description 3', price: 21, count: getRandomNumber(0, 100) },
  { id: '4', title: 'Book 4', description: 'Description 4', price: 7,  count: getRandomNumber(0, 100) },
  { id: '5', title: 'Book 5', description: 'Description 5', price: 17, count: getRandomNumber(0, 100) },
];

export const getProducts = (): Promise<Array<Product>> => Promise.resolve(availableProducts.map(({ count, ...rest }) => rest));

export const getAvailableProducts = (): Promise<Array<AvailableProduct>> => Promise.resolve(availableProducts);

export const getProductById = (id: string): Promise<AvailableProduct | null> => Promise.resolve(availableProducts.find((product) => product.id === id) || null);
