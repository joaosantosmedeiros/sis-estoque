import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CategoryRepository } from '@application/repositories/category.repository';
import { PrismaCategoryRepository } from './prisma/repository/prisma-category.respository';
import { ProductRepository } from '@application/repositories/product.repository';
import { PrismaProductRepository } from './prisma/repository/prisma-product.repository';
import { StockRepository } from '@application/repositories/stock.repository';
import { PrismaStockRepository } from './prisma/repository/prisma-stock.repository';
import { LogRepository } from '@application/repositories/log.repository';
import { PrismaLogRepository } from './prisma/repository/prisma-log.repository';
import { AccountRepository } from '@application/repositories/account.repository';
import { PrismaAccountRepository } from './prisma/repository/prisma-account.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository,
    },
    {
      provide: ProductRepository,
      useClass: PrismaProductRepository,
    },
    {
      provide: StockRepository,
      useClass: PrismaStockRepository,
    },
    {
      provide: LogRepository,
      useClass: PrismaLogRepository,
    },
    {
      provide: AccountRepository,
      useClass: PrismaAccountRepository,
    },
  ],
  exports: [
    CategoryRepository,
    ProductRepository,
    StockRepository,
    LogRepository,
    AccountRepository,
  ],
})
export class DatabaseModule {}
