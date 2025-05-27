import { InMemoryCategoryRepository } from '@test/repositories/in-memory-category.repository';
import { CreateCategoryUseCase } from './create-category.usecase';
import { FindCategoryByNameUseCase } from './find-category-by-name.usecase';
import { EntityAlreadyExistsError } from '@application/errors/entity-already-exists.error';

const makeSut = () => {
  const categoryRepository = new InMemoryCategoryRepository();
  const createCategory = new CreateCategoryUseCase(
    categoryRepository,
    new FindCategoryByNameUseCase(categoryRepository),
  );
  return { categoryRepository, createCategory };
};

describe('Create Category Use Case', () => {
  it('should be able to create a new category', async () => {
    const { createCategory } = makeSut();

    const category = await createCategory.execute({
      name: 'any_name',
      isActive: true,
    });

    const category2 = await createCategory.execute({
      name: 'another_name',
      isActive: true,
    });

    expect(category).toBeTruthy();
    expect(category.id).toBe(0);

    expect(category2).toBeTruthy();
    expect(category2.id).toBe(1);
  });

  it('should not be able to create an category with an used name', async () => {
    const { createCategory } = makeSut();

    await createCategory.execute({
      name: 'any_name',
      isActive: true,
    });

    await expect(
      createCategory.execute({
        name: 'any_name',
        isActive: true,
      }),
    ).rejects.toThrow(EntityAlreadyExistsError);
  });
});
