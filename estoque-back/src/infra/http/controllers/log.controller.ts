import { FindLogByIdUseCase } from '@application/usecases/log/find-log-by-id.usecase';
import { Controller, Get, Param } from '@nestjs/common';
import { FindLogByStock } from '@application/usecases/log/find-log-by-stock.usecase';
import { ListLogUseCase } from '@application/usecases/log/list-logs.usecase';
import { ReturnLogDto } from '@infra/dto/return-log.dto';

@Controller('log')
export class LogController {
  constructor(
    private readonly listLogUseCase: ListLogUseCase,
    private readonly findLogByIdUseCase: FindLogByIdUseCase,
    private readonly findLogByStockUseCase: FindLogByStock,
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
}
