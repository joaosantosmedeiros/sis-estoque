import { FindProductByIdUseCase } from '@application/usecases/product/find-product-by-id.usecase';
import { CreateStockUseCase } from '@application/usecases/stock/create-stock.usecase';
import { FindStockByIdUseCase } from '@application/usecases/stock/find-stock-by-id.usecase';
import { FindStockByProductUseCase } from '@application/usecases/stock/find-stock-by-product.usecase';
import { ListStockUseCase } from '@application/usecases/stock/list-stock.usecase';
import { UpdateStockUseCase } from '@application/usecases/stock/update-stock.usecase';

import { CreateStockDto } from '@infra/dto/create-stock.dto';
import { ReturnStockDto } from '@infra/dto/return-stock.dto';
import { UpdateStockDto } from '@infra/dto/update-stock.dto';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

@Controller('stock')
export class StockController {
  constructor(
    private readonly createStockUseCase: CreateStockUseCase,
    private readonly listStockUseCase: ListStockUseCase,
    private readonly findStockByIdUseCase: FindStockByIdUseCase,
    private readonly findStockByProductUseCase: FindStockByProductUseCase,
    private readonly updateStockUseCase: UpdateStockUseCase,
    private readonly findProductByIdUseCase: FindProductByIdUseCase,
  ) {}

  @Get()
  async list(): Promise<ReturnStockDto[]> {
    return (await this.listStockUseCase.execute()).map(
      (stock) => new ReturnStockDto(stock),
    );
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<ReturnStockDto> {
    return new ReturnStockDto(
      await this.findStockByIdUseCase.execute(Number(id)),
    );
  }

  @Get('byProduct/:productId')
  async findByProduct(
    @Param('productId') productId: number,
  ): Promise<ReturnStockDto> {
    return new ReturnStockDto(
      await this.findStockByProductUseCase.execute(Number(productId)),
    );
  }

  @Post()
  async create(@Body() body: CreateStockDto): Promise<ReturnStockDto> {
    await this.findProductByIdUseCase.execute(body.productId);

    return new ReturnStockDto(await this.createStockUseCase.execute(body));
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateStockDto,
  ): Promise<ReturnStockDto> {
    id = Number(id);
    const stock = await this.findStockByIdUseCase.execute(id);
    const updatedStock = await this.updateStockUseCase.execute(
      stock,
      body.quantity,
    );

    return new ReturnStockDto(updatedStock);
  }
}