import { Product } from '@application/entities/product';
import { Product as PrismaProduct } from '@prisma/client';
import { PrismaCategoryMapper } from './prisma-category.mapper';

export class PrismaProductMapper {
  static toPrisma(product: Product): PrismaProduct {
    return {
      id: product.id!,
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
      isActive: product.isActive,
    };
  }

  static toDomain(raw: any): Product {
    return new Product(
      {
        name: raw.name,
        categoryId: raw.categoryId,
        price: raw.price,
        isActive: raw.isActive,
        category: raw.category
          ? PrismaCategoryMapper.toDomain(raw.category)
          : undefined,
      },
      raw.id,
    );
  }
}
