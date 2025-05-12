import { InMemoryProductRepository } from '@test/repositories/in-memory-product.repository';
import { UpdateProductUseCase } from './update-product.usecase';
import { makeProduct } from '@test/factories/product.factory';

const makeSut = () => {
  const productRepository = new InMemoryProductRepository();
  const updateCategory = new UpdateProductUseCase(productRepository);
  return { productRepository, updateCategory };
};

describe('UpdateCategoryUseCase', () => {
  it('should update a product properly', async () => {
    const { productRepository, updateCategory } = makeSut();

    await productRepository.create(makeProduct());
    const product = productRepository.products[0];

    const updatedCategory = await updateCategory.execute({
      id: product.id!,
      name: 'updated_name',
      categoryId: 2,
      price: 456.5,
    });

    expect(updatedCategory.name).toBe('updated_name');
    expect(updatedCategory.price).toBe(456.5);
    expect(updatedCategory.categoryId).toBe(2);
  });

  it('should not update an unexistent product', async () => {
    const { updateCategory } = makeSut();

    await expect(
      updateCategory.execute({
        id: -999,
        name: 'any_name',
        categoryId: 1,
        price: 24.22,
      }),
    ).rejects.toThrow();
  });
});
