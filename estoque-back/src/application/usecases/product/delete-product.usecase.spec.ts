import { InMemoryProductRepository } from '@test/repositories/in-memory-product.repository';
import { DeleteProductUsecase } from './delete-product.usecase';
import { makeProduct } from '@test/factories/product.factory';

describe('DeleteProductUseCase', () => {
  it('should delete a product correctly', async () => {
    const repository = new InMemoryProductRepository();
    const deleteUseCase = new DeleteProductUsecase(repository);

    await repository.create(makeProduct());
    await deleteUseCase.execute(repository.products[0].id!);

    expect(repository.products.length).toEqual(0);
  });

  it('should throw if an invalid product is deleted', async () => {
    const repository = new InMemoryProductRepository();
    const deleteUseCase = new DeleteProductUsecase(repository);

    await expect(deleteUseCase.execute(-99)).rejects.toThrow(Error);
    expect(repository.products.length).toEqual(0);
  });
});
