import { Category } from '@application/entities/category';

export abstract class CategoryRepository {
  abstract findContainingName(name: string): Promise<Category[]>;
  abstract findById(id: number): Promise<Category | null>;
  abstract findByName(name: string): Promise<Category | null>;
  abstract list(): Promise<Category[]>;
  abstract create(category: Category): Promise<Category>;
  abstract update(
    id: number,
    name: string,
    isActive: boolean,
  ): Promise<Category>;
  abstract delete(id: number): Promise<void>;
}
