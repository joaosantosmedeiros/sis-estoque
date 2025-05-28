import { DatabaseModule } from '@infra/database/databale.module';
import { Module } from '@nestjs/common';
import { CategoryController } from './controllers/category.controller';
import { CreateCategoryUseCase } from '@application/usecases/category/create-category.usecase';
import { DeleteCategoryUseCase } from '@application/usecases/category/delete-category.usecase';
import { FindCategoryByIdUseCase } from '@application/usecases/category/find-category-by-id.usecase';
import { FindCategoryByNameUseCase } from '@application/usecases/category/find-category-by-name.usecase';
import { ListCategoriesUseCase } from '@application/usecases/category/list-categories.usecase';
import { UpdateCategoryUseCase } from '@application/usecases/category/update-category.usecase';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { CreateProductUseCase } from '@application/usecases/product/create-product.usecase';
import { ListProductsUseCase } from '@application/usecases/product/list-products.usecase';
import { FindProductByCategory } from '@application/usecases/product/find-product-by-category.usecase';
import { FindProductByIdUseCase } from '@application/usecases/product/find-product-by-id.usecase';
import { FindProductByNameUseCase } from '@application/usecases/product/find-product-by-name.usecase';
import { DeleteProductUsecase } from '@application/usecases/product/delete-product.usecase';
import { UpdateProductUseCase } from '@application/usecases/product/update-product.usecase';
import { ProductController } from './controllers/product.controller';
import { FindCategoryContainingNameUseCase } from '@application/usecases/category/find-category-containing-name.usecase';
import { StockController } from './controllers/stock.controller';
import { CreateStockUseCase } from '@application/usecases/stock/create-stock.usecase';
import { FindStockByIdUseCase } from '@application/usecases/stock/find-stock-by-id.usecase';
import { FindStockByProductUseCase } from '@application/usecases/stock/find-stock-by-product.usecase';
import { ListStockUseCase } from '@application/usecases/stock/list-stock.usecase';
import { UpdateStockUseCase } from '@application/usecases/stock/update-stock.usecase';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController, ProductController, StockController,],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ErrorInterceptor },
    CreateCategoryUseCase,
    ListCategoriesUseCase,
    FindCategoryByIdUseCase,
    FindCategoryByNameUseCase,
    FindCategoryContainingNameUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,

    CreateProductUseCase,
    ListProductsUseCase,
    FindProductByCategory,
    FindProductByIdUseCase,
    FindProductByNameUseCase,
    UpdateProductUseCase,
    DeleteProductUsecase,

    CreateStockUseCase,
    ListStockUseCase,
    FindStockByIdUseCase,
    FindStockByProductUseCase,
    UpdateStockUseCase,
  ],
})
export class HttpModule {}
