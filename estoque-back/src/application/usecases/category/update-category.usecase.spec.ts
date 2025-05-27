import { makeCategory } from '@test/factories/category.factory';
import { InMemoryCategoryRepository } from '@test/repositories/in-memory-category.repository';
import { FindCategoryByNameUseCase } from './find-category-by-name.usecase';
import { UpdateCategoryUseCase } from './update-category.usecase';
import { EntityAlreadyExistsError } from '@application/errors/entity-already-exists.error';

const makeSut = () => {
  const categoryRepository = new InMemoryCategoryRepository();
  const updateCategory = new UpdateCategoryUseCase(
    categoryRepository,
    new FindCategoryByNameUseCase(categoryRepository),
  );
  return { categoryRepository, updateCategory };
};

describe('UpdateCategoryUseCase', () => {
  it('should update a category properly', async () => {
    const { categoryRepository, updateCategory } = makeSut();
    const expected = 'updated_name';

    await categoryRepository.create(makeCategory());
    const category = categoryRepository.categories[0];

    const updatedCategory = await updateCategory.execute({
      id: category.id!,
      name: 'updated_name',
      isActive: true,
    });
    const actual = updatedCategory.name;

    expect(actual).toBe(expected);
  });

  it('should not update an unexistent category', async () => {
    const { updateCategory } = makeSut();

    await expect(
      updateCategory.execute({
        id: -999,
        name: 'any_name',
        isActive: true,
      }),
    ).rejects.toThrow();
  });

  it('should not update a category with invalid name', async () => {
    const { categoryRepository, updateCategory } = makeSut();

    await categoryRepository.create(makeCategory());
    await categoryRepository.create(makeCategory('another_category'));

    const category = categoryRepository.categories[0];

    await expect(
      updateCategory.execute({
        id: category.id!,
        name: 'another_category',
        isActive: true,
      }),
    ).rejects.toThrow(EntityAlreadyExistsError);
  });
});
