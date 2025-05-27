import { Category } from '@application/entities/category';

export class PrismaCategoryMapper {
  static toPrisma(category: Category) {
    return {
      id: category.id,
      name: category.name,
      isActive: category.isActive,
    };
  }

  static toDomain(raw: any) {
    return new Category(
      {
        name: raw.name,
        isActive: raw.isActive,
      },
      raw.id,
    );
  }
}
