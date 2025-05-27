import { InMemoryProductRepository } from '@test/repositories/in-memory-product.repository';
import { CreateProductUseCase } from './create-product.usecase';
import { FindCategoryByIdUseCase } from '../category/find-category-by-id.usecase';
import { InMemoryCategoryRepository } from '@test/repositories/in-memory-category.repository';
import { makeCategory } from '@test/factories/category.factory';
import { makeProduct } from '@test/factories/product.factory';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';

const makeSut = () => {
  const categoryRepository = new InMemoryCategoryRepository();
  const findCategory = new FindCategoryByIdUseCase(categoryRepository);
  const productRepository = new InMemoryProductRepository();
  const createProduct = new CreateProductUseCase(
    productRepository,
    findCategory,
  );
  return { productRepository, createProduct, categoryRepository };
};

describe('CreateProductUsecase', () => {
  it('should create a product correctly', async () => {
    const { categoryRepository, createProduct, productRepository } = makeSut();
    await categoryRepository.create(makeCategory());
    const category = categoryRepository.categories[0];

    const product = await createProduct.execute({
      categoryId: category.id!,
      name: 'any_name',
      price: 24,
      isActive: true,
    });

    expect(productRepository.products[0]).toBe(product);
  });

  it('should throw if no category is found', async () => {
    const { productRepository, createProduct } = makeSut();
    await productRepository.create(makeProduct());

    await expect(
      createProduct.execute({
        name: 'any_name',
        categoryId: 1,
        price: 24.22,
        isActive: true,
      }),
    ).rejects.toThrow(EntityNotFoundError);
  });

  it('should throw if the found category is inactive', async () => {
    const { productRepository, createProduct, categoryRepository } = makeSut();
    await categoryRepository.create(makeCategory('any_name', false));
    const category = categoryRepository.categories[0];
    await productRepository.create(makeProduct());

    await expect(
      createProduct.execute({
        name: 'any_name',
        categoryId: category.id!,
        price: 24.22,
        isActive: true,
      }),
    ).rejects.toThrow(EntityNotFoundError);
  });
});
