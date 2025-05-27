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
import { CreateStockUseCase } from '@application/usecases/stock/create-stock.usecase';
import { ListStockUseCase } from '@application/usecases/stock/list-stock.usecase';
import { FindStockByIdUseCase } from '@application/usecases/stock/find-stock-by-id.usecase';
import { FindStockByProductUseCase } from '@application/usecases/stock/find-stock-by-product.usecase';
import { StockController } from './controllers/stock.controller';
import { LogController } from './controllers/log.controller';
import { FindLogByIdUseCase } from '@application/usecases/log/find-log-by-id.usecase';
import { FindLogByStock } from '@application/usecases/log/find-log-by-stock.usecase';
import { CreateLogUseCase } from '@application/usecases/log/create-log.usecase';
import { ListLogUseCase } from '@application/usecases/log/list-logs.usecase';
import { UpdateStockUseCase } from '@application/usecases/stock/update-stock.usecase';
import { FindCategoryContainingNameUseCase } from '@application/usecases/category/find-category-containing-name.usecase';
import { AccountController } from './controllers/account.controller';
import { CreateAccountUseCase } from '@application/usecases/account/create-account-usecase';
import { FindAccountByIdUseCase } from '@application/usecases/account/find-account-by-id-usecase';
import { FindAccountByNameUseCase } from '@application/usecases/account/find-account-by-name-usecase';
import { UpdateAccountUseCase } from '@application/usecases/account/update-account-usecase';
import { DeleteAccountUseCase } from '@application/usecases/account/delete-account-usecase';
import { ListAccountsUseCase } from '@application/usecases/account/list-accounts-usecase';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [
    CategoryController,
    ProductController,
    StockController,
    LogController,
    AccountController,
  ],
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

    CreateLogUseCase,
    FindLogByIdUseCase,
    FindLogByStock,
    ListLogUseCase,

    CreateAccountUseCase,
    FindAccountByIdUseCase,
    FindAccountByNameUseCase,
    ListAccountsUseCase,
    UpdateAccountUseCase,
    DeleteAccountUseCase,
  ],
})
export class HttpModule {}
