import { Log } from '@application/entities/log';
import { ReturnStockDto } from './return-stock.dto';
import { ReturnAccountDto } from './return-account.dto';

export class ReturnLogDto {
  id: number;
  quantity: number;
  date: Date;
  stock?: ReturnStockDto;
  account?: ReturnAccountDto;

  constructor(log: Log) {
    this.id = log.id!;
    this.quantity = log.quantity;
    this.date = log.date;
    this.stock = log.stock ? new ReturnStockDto(log.stock) : undefined;
    this.account = log.account ? new ReturnAccountDto(log.account) : undefined;
  }
}
