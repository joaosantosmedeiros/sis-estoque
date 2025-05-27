import { Category } from './category';
import { Product } from './product';

describe('Product', () => {
  it('should be able to create a new product', () => {
    const product = new Product({
      name: 'any_name',
      categoryId: 0,
      price: 25.5,
      isActive: true,
    });
    expect(product).toBeTruthy();
  });

  it('should create a new product with correct values', () => {
    const product = new Product({
      name: 'any_name',
      categoryId: 0,
      price: 25.5,
      isActive: true,
    });

    expect(product.id).toBeUndefined();
    expect(product.name).toBe('any_name');
  });

  it('should update product with correct values', () => {
    const product = new Product({
      name: 'any_name',
      categoryId: 0,
      price: 25.5,
      isActive: true,
    });
    const name = 'another_name';
    const price = 12.75;
    const anotherCategory = new Category(
      { name: 'another_category', isActive: true },
      1,
    );

    product.name = name;
    product.price = price;
    product.category = anotherCategory;

    expect(product.name).toBe(name);
    expect(product.price).toBe(price);
    expect(product.category).toBe(anotherCategory);
    expect(product.categoryId).toBe(anotherCategory.id);
    expect(product.id).toBeUndefined();
  });
});
