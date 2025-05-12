import { Stock } from '@application/entities/stock';
import { StockRepository } from '@application/repositories/stock.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListStockUseCase {
  constructor(private readonly stockRepository: StockRepository) {}

  async execute(): Promise<Stock[]> {
    return this.stockRepository.list();
  }
}
