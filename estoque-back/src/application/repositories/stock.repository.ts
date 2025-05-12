import { Stock } from '@application/entities/stock';

export abstract class StockRepository {
  abstract findById(id: number): Promise<Stock | null>;
  abstract findByProduct(productId: number): Promise<Stock | null>;
  abstract list(): Promise<Stock[]>;
  abstract create(stock: Stock): Promise<Stock>;
  abstract update(id: number, quantity: number): Promise<Stock>;
}
