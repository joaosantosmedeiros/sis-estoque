import { Product } from '@application/entities/product';

export function makeProduct(name = 'any_name'): Product {
  return new Product({
    name,
    categoryId: 0,
    price: 25.5,
    isActive: true,
  });
}
