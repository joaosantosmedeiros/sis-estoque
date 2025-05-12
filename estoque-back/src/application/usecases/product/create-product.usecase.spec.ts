import { InMemoryProductRepository } from '@test/repositories/in-memory-product.repository';
import { CreateProductUseCase } from './create-product.usecase';

describe('CreateProductUsecase', () => {
  it('should create a product correctly', async () => {
    const repository = new InMemoryProductRepository();
    const createProduct = new CreateProductUseCase(repository);

    const product = await createProduct.execute({
      categoryId: 1,
      name: 'any_name',
      price: 24,
    });

    expect(repository.products[0]).toBe(product);
  });
});
