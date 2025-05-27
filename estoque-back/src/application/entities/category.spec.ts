import { Category } from './category';

describe('Category', () => {
  it('should create a new category with correct values', () => {
    const category = new Category({ name: 'any_name', isActive: true });

    expect(category).toBeTruthy();
    expect(category.id).toBeUndefined();
    expect(category.name).toBe('any_name');
  });

  it('should update category with correct values', () => {
    const category = new Category({ name: 'any_name', isActive: true });
    category.name = 'another_name';
    category.isActive = false;

    expect(category.name).toBe('another_name');
    expect(category.isActive).toBe(false);
  });
});
