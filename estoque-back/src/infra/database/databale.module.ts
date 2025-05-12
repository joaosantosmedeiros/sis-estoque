import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CategoryRepository } from '@application/repositories/category.repository';
import { PrismaCategoryRepository } from './prisma/repository/prisma-category.respository';
import { ProductRepository } from '@application/repositories/product.repository';
import { PrismaProductRepository } from './prisma/repository/prisma-product.repository';

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
  ],
  exports: [CategoryRepository, ProductRepository],
})
export class DatabaseModule {}
