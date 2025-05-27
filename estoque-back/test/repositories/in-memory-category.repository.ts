import { Category } from '@application/entities/category';
import { CategoryRepository } from '@application/repositories/category.repository';
import { EntityAlreadyExistsError } from '@application/errors/entity-already-exists.error';

export class InMemoryCategoryRepository implements CategoryRepository {
  public categories: Category[] = [];
  public static count = 0;

  async findById(id: number): Promise<Category | null> {
    return this.categories.find((category) => category.id === id) || null;
  }

  async findByName(name: string): Promise<Category | null> {
    const category = this.categories.find((category) => category.name === name);
    return category ?? null;
  }

  async findContainingName(name: string): Promise<Category[]> {
    return this.categories.filter((category) => category.name.includes(name));
  }

  async list(): Promise<Category[]> {
    return this.categories;
  }

  async create(newCategory: Category): Promise<Category> {
    if (
      this.categories.find((category) => category.name === newCategory.name)
    ) {
      throw new EntityAlreadyExistsError('Categoria');
    }
    newCategory.id = InMemoryCategoryRepository.count;
    InMemoryCategoryRepository.count++;
    this.categories.push(newCategory);

    return newCategory;
  }

  async update(id: number, name: string, isActive: boolean): Promise<Category> {
    const index = this.categories.findIndex((ctegory) => ctegory.id === id);
    if (index == -1) throw new Error('Category not found');

    this.categories[index].name = name;
    this.categories[index].isActive = isActive;

    return this.categories[index];
  }

  async delete(id: number): Promise<void> {
    const index = this.categories.findIndex((acc) => acc.id === id);

    if (index === -1) {
      throw new Error('Category not found');
    }

    this.categories.splice(index, 1);
  }
}
