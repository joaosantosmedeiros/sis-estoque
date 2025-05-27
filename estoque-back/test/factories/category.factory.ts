import { Category } from '@application/entities/category';

export function makeCategory(name = 'any_name', isActive = true): Category {
  return new Category({ name, isActive });
}
