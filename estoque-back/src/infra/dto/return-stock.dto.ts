import { ReturnProductDto } from './return-product.dto';
import { Stock } from '@application/entities/stock';

export class ReturnStockDto {
  id: number;
  quantity: number;
  product?: ReturnProductDto;

  constructor(stock: Stock) {
    this.id = stock.id!;
    this.quantity = stock.quantity;
    this.product = stock.product
      ? new ReturnProductDto(stock.product)
      : undefined;
  }
}
