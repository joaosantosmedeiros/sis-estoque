import { CreateLogUseCase } from '@application/usecases/log/create-log.usecase';
import { FindLogByIdUseCase } from '@application/usecases/log/find-log-by-id.usecase';

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FindLogByStock } from '@application/usecases/log/find-log-by-stock.usecase';
import { ListLogUseCase } from '@application/usecases/log/list-logs.usecase';
import { CreateLogDto } from '@infra/dto/create-log.dto';
import { ReturnLogDto } from '@infra/dto/return-log.dto';
import { FindStockByIdUseCase } from '@application/usecases/stock/find-stock-by-id.usecase';
import { Stock } from '@application/entities/stock';
import { UpdateStockUseCase } from '@application/usecases/stock/update-stock.usecase';

@Controller('log')
export class LogController {
  constructor(
    private readonly createLogUseCase: CreateLogUseCase,
    private readonly listLogUseCase: ListLogUseCase,
    private readonly findLogByIdUseCase: FindLogByIdUseCase,
    private readonly findLogByStockUseCase: FindLogByStock,
    private readonly findStockByIdUseCase: FindStockByIdUseCase,
    private readonly updateStockUseCase: UpdateStockUseCase,
  ) {}

  @Get()
  async list(): Promise<ReturnLogDto[]> {
    return (await this.listLogUseCase.execute()).map(
      (log) => new ReturnLogDto(log),
    );
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<ReturnLogDto> {
    return new ReturnLogDto(await this.findLogByIdUseCase.execute(Number(id)));
  }

  @Get('byStock/:stockId')
  async findByStock(
    @Param('stockId') stockId: number,
  ): Promise<ReturnLogDto[]> {
    return (await this.findLogByStockUseCase.execute(Number(stockId))).map(
      (log) => new ReturnLogDto(log),
    );
  }

  @Post()
  async create(@Body() body: CreateLogDto): Promise<ReturnLogDto> {
    const stock: Stock = await this.findStockByIdUseCase.execute(body.stockId);

    await this.updateStockUseCase.execute(stock, body.quantity);

    return new ReturnLogDto(
      await this.createLogUseCase.execute({
        date: body.date,
        quantity: body.quantity,
        stock,
      }),
    );
  }
}
