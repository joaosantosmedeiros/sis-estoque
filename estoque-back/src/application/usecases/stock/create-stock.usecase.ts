import { Stock } from '@application/entities/stock';
import { EntityInUseError } from '@application/errors/entity-in-use.error';
import { InvalidFieldError } from '@application/errors/invalid-field.error';
import { StockRepository } from '@application/repositories/stock.repository';
import { Injectable } from '@nestjs/common';

export interface CreateStockRequest {
  quantity: number;
  productId: number;
}

@Injectable()
export class CreateStockUseCase {
  constructor(private readonly stockRepository: StockRepository) {}

  async execute(request: CreateStockRequest): Promise<Stock> {
    const { productId, quantity } = request;

    if (quantity < 0) throw new InvalidFieldError(['quantity']);

    if (await this.stockRepository.findByProduct(productId))
      throw new EntityInUseError('product');

    return this.stockRepository.create(new Stock({ productId, quantity }));
  }
}
