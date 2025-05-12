import { InMemoryProductRepository } from '@test/repositories/in-memory-product.repository';
import { FindProductByNameUseCase } from './find-product-by-name.usecase';
import { makeProduct } from '@test/factories/product.factory';
import { Product } from '@application/entities/product';

describe('FindProductByNameUseCase', () => {
  it('should find all products', async () => {
    const repository = new InMemoryProductRepository();
    const findByName = new FindProductByNameUseCase(repository);
    const products: Product[] = [
      makeProduct('test'),
      makeProduct('any_name'),
      makeProduct('any_name_2'),
      makeProduct('another_name'),
    ];

    for (const product of products) await repository.create(product);

    const foundsProduct = await findByName.execute('name');
    expect(foundsProduct).toEqual(products.slice(1));
  });

  it('should return an empty list if no product is found', async () => {
    const repository = new InMemoryProductRepository();
    const findByName = new FindProductByNameUseCase(repository);
    const products: Product[] = [
      makeProduct('test'),
      makeProduct('any_name'),
      makeProduct('any_name_2'),
      makeProduct('another_name'),
    ];

    for (const product of products) await repository.create(product);

    const foundsProduct = await findByName.execute('invalid_name');
    expect(foundsProduct).toEqual([]);
  });
});
