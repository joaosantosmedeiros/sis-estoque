import { makeProduct } from '@test/factories/product.factory';
import { InMemoryProductRepository } from '@test/repositories/in-memory-product.repository';
import { FindProductByIdUseCase } from './find-product-by-id.usecase';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';

describe('FindProductById', () => {
  it('should find an existing product', async () => {
    const productRepository = new InMemoryProductRepository();
    const findProductById = new FindProductByIdUseCase(productRepository);

    await productRepository.create(makeProduct());
    await productRepository.create(makeProduct('another_name'));

    const products = await productRepository.list();
    const product = await findProductById.execute(products[1].id!);

    expect(product).toBe(products[1]);
  });

  it('should throw if no product is found', async () => {
    const productRepository = new InMemoryProductRepository();
    const findProductById = new FindProductByIdUseCase(productRepository);

    await expect(findProductById.execute(-999)).rejects.toThrow(
      EntityNotFoundError,
    );
  });
});
