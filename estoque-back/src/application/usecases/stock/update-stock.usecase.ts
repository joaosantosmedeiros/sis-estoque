import { Stock } from '@application/entities/stock';
import { StockRepository } from '@application/repositories/stock.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateStockUseCase {
  constructor(private readonly stockRepository: StockRepository) {}

  async execute(stock: Stock, quantity: number): Promise<Stock> {
    if (stock.quantity + quantity < 0)
      throw new Error('Stock quantity must be positive.');

    return this.stockRepository.update(stock.id!, quantity);
  }
}
