import { Stock } from '@application/entities/stock';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';
import { StockRepository } from '@application/repositories/stock.repository';

export class InMemoryStockRepository implements StockRepository {
  public stocks: Stock[] = [];
  public static count = 0;

  async findById(id: number): Promise<Stock | null> {
    const stock = this.stocks.find((stock) => stock.id === id);
    return stock ?? null;
  }

  async findByProduct(productId: number): Promise<Stock | null> {
    return this.stocks.find((stock) => stock.productId == productId) || null;
  }

  async list(): Promise<Stock[]> {
    return this.stocks;
  }

  async create(newStock: Stock): Promise<Stock> {
    newStock.id = InMemoryStockRepository.count;
    InMemoryStockRepository.count++;
    this.stocks.push(newStock);

    return newStock;
  }

  async update(id: number, quantity: number): Promise<Stock> {
    const index = this.stocks.findIndex((stock) => stock.id === id);
    if (index == -1) throw new EntityNotFoundError('Stock not found');

    this.stocks[index].quantity = quantity;

    return this.stocks[index];
  }
}
