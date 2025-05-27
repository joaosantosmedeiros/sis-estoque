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
  Query,
} from '@nestjs/common';
import { Roles } from '../decoretors/roles.decorator';
import { UserType } from 'src/enums/user-type.enum';

@Controller('product')
export class ProductController {
  constructor(
    private readonly findCategoryByIdUseCase: FindCategoryByIdUseCase,

    private readonly createProductUseCase: CreateProductUseCase,
    private readonly listAllProductsUseCase: ListProductsUseCase,
    private readonly findProductByIdUseCase: FindProductByIdUseCase,
    private readonly findProductByNameUseCase: FindProductByNameUseCase,
    private readonly findProductByCategoryUseCase: FindProductByCategory,
    private readonly deleteProductByIdUseCase: DeleteProductUsecase,
    private readonly updateProductUseCase: UpdateProductUseCase,

    private readonly createStockUseCase: CreateStockUseCase,
  ) {}

  @Roles(UserType.Admin, UserType.User)
  @Get()
  async list(
    @Query('includeInactives') includeInactives: boolean,
  ): Promise<ReturnProductDto[]> {
    return (await this.listAllProductsUseCase.execute(includeInactives)).map(
      (product) => new ReturnProductDto(product),
    );
  }

  @Roles(UserType.Admin, UserType.User)
  @Get('byName/:name')
  async findByName(@Param('name') name: string): Promise<ReturnProductDto[]> {
    return (await this.findProductByNameUseCase.execute(name)).map(
      (product) => new ReturnProductDto(product),
    );
  }

  @Roles(UserType.Admin, UserType.User)
  @Get(':id')
  async findById(@Param('id') id: number): Promise<ReturnProductDto> {
    return new ReturnProductDto(
      await this.findProductByIdUseCase.execute(Number(id)),
    );
  }

  @Roles(UserType.Admin, UserType.User)
  @Get('byCategory/:categoryId')
  async findByCategory(
    @Param('categoryId') categoryId: number,
  ): Promise<ReturnProductDto[]> {
    return (
      await this.findProductByCategoryUseCase.execute(Number(categoryId))
    ).map((product) => new ReturnProductDto(product));
  }

  @Roles(UserType.Admin)
  @Post()
  async create(@Body() body: CreateProductDto): Promise<ReturnProductDto> {
    const product = await this.createProductUseCase.execute(body);

    await this.createStockUseCase.execute({
      productId: product.id!,
      quantity: 0,
    });

    return new ReturnProductDto(product);
  }

  @Roles(UserType.Admin)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: CreateProductDto,
  ): Promise<ReturnProductDto> {
    id = Number(id);

    await this.findProductByIdUseCase.execute(id);

    return new ReturnProductDto(
      await this.updateProductUseCase.execute({
        id,
        ...body,
      }),
    );
  }

  @Roles(UserType.Admin)
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
