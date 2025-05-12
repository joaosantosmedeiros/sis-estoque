import { makeProduct } from '@test/factories/product.factory';
import { ListProductsUseCase } from './list-products.usecase';
import { InMemoryProductRepository } from '@test/repositories/in-memory-product.repository';

describe('List Categories Use Case', () => {
  it('should list products correctly', async () => {
    const inMemoryProductRepository = new InMemoryProductRepository();
    const listCategoriesUseCase = new ListProductsUseCase(
      inMemoryProductRepository,
    );
    const expected = 2;

    await inMemoryProductRepository.create(makeProduct());
    await inMemoryProductRepository.create(makeProduct('another_name'));

    const actual = (await listCategoriesUseCase.execute()).length;

    expect(actual).toBe(expected);
  });
});
