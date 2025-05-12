import { Log } from '@application/entities/log';
import { Log as PrismaLog } from '@prisma/client';
import { PrismaStockMapper } from './prisma-stock.mapper';

export class PrismaLogMapper {
  static toPrisma(log: Log): PrismaLog {
    return {
      id: log.id!,
      quantity: log.quantity,
      stockId: log.stockId,
      date: log.date,
    };
  }

  static toDomain(raw: any): Log {
    return new Log(
      {
        stockId: raw.stockId,
        quantity: raw.quantity,
        stock: raw.stock ? PrismaStockMapper.toDomain(raw.stock) : undefined,
        date: raw.date,
      },
      raw.id,
    );
  }
}
