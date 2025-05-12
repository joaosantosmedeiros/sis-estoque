import { Stock } from '@application/entities/stock';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';
import { StockRepository } from '@application/repositories/stock.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindStockByIdUseCase {
  constructor(private readonly stockRepository: StockRepository) {}

  async execute(id: number): Promise<Stock> {
    const stock = await this.stockRepository.findById(id);
    if (!stock) throw new EntityNotFoundError('Stock');

    return stock;
  }
}
