import { Log } from '@application/entities/log';
import { Log as PrismaLog } from '@prisma/client';
import { PrismaStockMapper } from './prisma-stock.mapper';
import { PrismaAccountMapper } from './prisma-account.mapper';

export class PrismaLogMapper {
  static toPrisma(log: Log): PrismaLog {
    return {
      id: log.id!,
      quantity: log.quantity,
      stockId: log.stockId,
      accountId: log.accountId,
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
        accountId: raw.accountId,
        account: raw.Account
          ? PrismaAccountMapper.toDomain(raw.Account)
          : undefined,
      },
      raw.id,
    );
  }
}
