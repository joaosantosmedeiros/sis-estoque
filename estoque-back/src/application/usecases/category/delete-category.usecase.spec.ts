import { makeCategory } from '@test/factories/category.factory';
import { DeleteCategoryUseCase } from './delete-category.usecase';
import { InMemoryCategoryRepository } from '@test/repositories/in-memory-category.repository';

describe('DeleteCategoryUseCase', () => {
  it('should delete an category correctly', async () => {
    const categoryRepository = new InMemoryCategoryRepository();
    const deleteCategory = new DeleteCategoryUseCase(categoryRepository);

    await categoryRepository.create(makeCategory());
    const category = categoryRepository.categories[0];

    await deleteCategory.execute(category.id!);
    expect(categoryRepository.categories.length).toBe(0);
  });

  it('should not delete an unexistent category', async () => {
    const categoryRepository = new InMemoryCategoryRepository();
    const deleteCategory = new DeleteCategoryUseCase(categoryRepository);

    await expect(deleteCategory.execute(-999)).rejects.toThrow(Error);
  });
});
