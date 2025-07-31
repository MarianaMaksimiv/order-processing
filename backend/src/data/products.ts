import { Product } from '../types';

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Phone', price: 699 },
  { id: 3, name: 'Headphones', price: 199 },
  { id: 4, name: 'Tablet', price: 499 },
];

export const getProductById = (id: number): Product | undefined => {
  return PRODUCTS.find(product => product.id === id);
}; 