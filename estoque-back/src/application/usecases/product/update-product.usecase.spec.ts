import { InMemoryProductRepository } from '@test/repositories/in-memory-product.repository';
import { UpdateProductUseCase } from './update-product.usecase';
import { makeProduct } from '@test/factories/product.factory';
import { InMemoryCategoryRepository } from '@test/repositories/in-memory-category.repository';
import { FindCategoryByIdUseCase } from '../category/find-category-by-id.usecase';
import { makeCategory } from '@test/factories/category.factory';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';

const makeSut = () => {
  const categoryRepository = new InMemoryCategoryRepository();
  const findCategory = new FindCategoryByIdUseCase(categoryRepository);
  const productRepository = new InMemoryProductRepository();
  const updateProduct = new UpdateProductUseCase(
    productRepository,
    findCategory,
  );
  return { productRepository, updateProduct, categoryRepository };
};

describe('UpdateCategoryUseCase', () => {
  it('should update a product properly', async () => {
    const { productRepository, updateProduct, categoryRepository } = makeSut();
    await categoryRepository.create(makeCategory());
    await productRepository.create(makeProduct());
    const product = productRepository.products[0];
    const category = categoryRepository.categories[0];

    const updatedCategory = await updateProduct.execute({
      id: product.id!,
      name: 'updated_name',
      categoryId: category.id!,
      price: 456.5,
      isActive: true,
    });

    expect(updatedCategory.name).toBe('updated_name');
    expect(updatedCategory.price).toBe(456.5);
    expect(updatedCategory.categoryId).toBe(category.id!);
  });

  it('should throw if no category is found', async () => {
    const { productRepository, updateProduct } = makeSut();
    await productRepository.create(makeProduct());
    const product = productRepository.products[0];

    await expect(
      updateProduct.execute({
        id: product.id!,
        name: 'any_name',
        categoryId: 1,
        price: 24.22,
        isActive: true,
      }),
    ).rejects.toThrow(EntityNotFoundError);
  });

  it('should throw if the found category is inactive', async () => {
    const { productRepository, updateProduct, categoryRepository } = makeSut();
    await categoryRepository.create(makeCategory('any_name', false));
    const category = categoryRepository.categories[0];
    await productRepository.create(makeProduct());
    const product = productRepository.products[0];

    await expect(
      updateProduct.execute({
        id: product.id!,
        name: 'any_name',
        categoryId: category.id!,
        price: 24.22,
        isActive: true,
      }),
    ).rejects.toThrow(EntityNotFoundError);
  });

  it('should not update an unexistent product', async () => {
    const { updateProduct } = makeSut();

    await expect(
      updateProduct.execute({
        id: -999,
        name: 'any_name',
        categoryId: 1,
        price: 24.22,
        isActive: true,
      }),
    ).rejects.toThrow();
  });
});
