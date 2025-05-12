import { EntityInUseError } from '@application/errors/entity-in-use.error';
import { FindCategoryByIdUseCase } from '@application/usecases/category/find-category-by-id.usecase';
import { CreateProductUseCase } from '@application/usecases/product/create-product.usecase';
import { DeleteProductUsecase } from '@application/usecases/product/delete-product.usecase';
import { FindProductByCategory } from '@application/usecases/product/find-product-by-category.usecase';
import { FindProductByIdUseCase } from '@application/usecases/product/find-product-by-id.usecase';
import { FindProductByNameUseCase } from '@application/usecases/product/find-product-by-name.usecase';
import { ListProductsUseCase } from '@application/usecases/product/list-products.usecase';
import { UpdateProductUseCase } from '@application/usecases/product/update-product.usecase';
import { CreateStockUseCase } from '@application/usecases/stock/create-stock.usecase';
import { CreateProductDto } from '@infra/dto/create-product.dto';
import { ReturnProductDto } from '@infra/dto/return-product.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('product')
export class ProductController {
  constructor(
    private findCategoryByIdUseCase: FindCategoryByIdUseCase,

    private createProductUseCase: CreateProductUseCase,
    private listAllProductsUseCase: ListProductsUseCase,
    private findProductByIdUseCase: FindProductByIdUseCase,
    private findProductByNameUseCase: FindProductByNameUseCase,
    private findProductByCategoryUseCase: FindProductByCategory,
    private deleteProductByIdUseCase: DeleteProductUsecase,
    private updateProductUseCase: UpdateProductUseCase,

    private createStockUseCase: CreateStockUseCase,
  ) {}

  @Get()
  async list(): Promise<ReturnProductDto[]> {
    return (await this.listAllProductsUseCase.execute()).map(
      (product) => new ReturnProductDto(product),
    );
  }

  @Get('byName/:name')
  async findByName(@Param('name') name: string): Promise<ReturnProductDto[]> {
    return (await this.findProductByNameUseCase.execute(name)).map(
      (product) => new ReturnProductDto(product),
    );
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<ReturnProductDto> {
    return new ReturnProductDto(
      await this.findProductByIdUseCase.execute(Number(id)),
    );
  }

  @Get('byCategory/:categoryId')
  async findByCategory(
    @Param('categoryId') categoryId: number,
  ): Promise<ReturnProductDto[]> {
    return (
      await this.findProductByCategoryUseCase.execute(Number(categoryId))
    ).map((product) => new ReturnProductDto(product));
  }

  @Post()
  async create(@Body() body: CreateProductDto): Promise<ReturnProductDto> {
    await this.findCategoryByIdUseCase.execute(body.categoryId);
    const product = await this.createProductUseCase.execute(body);

    await this.createStockUseCase.execute({
      productId: product.id!,
      quantity: 0,
    });

    return new ReturnProductDto(product);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: CreateProductDto,
  ): Promise<ReturnProductDto> {
    id = Number(id);

    await this.findProductByIdUseCase.execute(id);
    await this.findCategoryByIdUseCase.execute(body.categoryId);

    return new ReturnProductDto(
      await this.updateProductUseCase.execute({
        id,
        ...body,
      }),
    );
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number): Promise<void> {
    id = Number(id);

    await this.findProductByIdUseCase.execute(id);

    try {
      await this.deleteProductByIdUseCase.execute(id);
    } catch (err: any) {
      if (err.code === 'P2003') {
        throw new EntityInUseError('produto');
      }
      console.log(err);
    }
  }
}
