import { Log } from '@application/entities/log';
import { ReturnStockDto } from './return-stock.dto';

export class ReturnLogDto {
  id: number;
  quantity: number;
  date: Date;
  stock?: ReturnStockDto;

  constructor(log: Log) {
    this.id = log.id!;
    this.quantity = log.quantity;
    this.date = log.date;
    this.stock = log.stock ? new ReturnStockDto(log.stock) : undefined;
  }
}
