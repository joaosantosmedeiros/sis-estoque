import { InMemoryProductRepository } from '@test/repositories/in-memory-product.repository';
import { FindProductByCategory } from './find-product-by-category.usecase';
import { makeProduct } from '@test/factories/product.factory';

describe('FindProductByCategoryUsecase', () => {
  it('should find products correctly', async () => {
    const repository = new InMemoryProductRepository();
    const findProduct = new FindProductByCategory(repository);
    const categoryId = 2;

    for (let i = 0; i < 3; i++) {
      const product = makeProduct();
      product.categoryId = categoryId;
      await repository.create(product);
    }
    await repository.create(makeProduct());
    const foundProducts = await findProduct.execute(categoryId);

    expect(foundProducts).toEqual(repository.products.slice(0, 3));
    expect(foundProducts.length).toBe(3);
  });

  it('should not find any products', async () => {
    const repository = new InMemoryProductRepository();
    const findProduct = new FindProductByCategory(repository);
    const categoryId = 2;

    for (let i = 0; i < 3; i++) {
      const product = makeProduct();
      product.categoryId = categoryId;
      await repository.create(product);
    }
    const foundProducts = await findProduct.execute(-999);

    expect(foundProducts).toEqual([]);
  });
});
