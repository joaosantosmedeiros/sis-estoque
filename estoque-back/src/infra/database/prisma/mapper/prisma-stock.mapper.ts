import { Stock } from '@application/entities/stock';
import { Stock as PrismaStock } from '@prisma/client';
import { PrismaProductMapper } from './prisma-product.mapper';

export class PrismaStockMapper {
  static toPrisma(stock: Stock): PrismaStock {
    return {
      id: stock.id!,
      quantity: stock.quantity,
      productId: stock.productId,
    };
  }

  static toDomain(raw: any): Stock {
    return new Stock(
      {
        productId: raw.productId,
        quantity: raw.quantity,
        product: raw.product
          ? PrismaProductMapper.toDomain(raw.product)
          : undefined,
      },
      raw.id,
    );
  }
}
