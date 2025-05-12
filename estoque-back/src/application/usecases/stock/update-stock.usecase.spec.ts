import { InMemoryStockRepository } from '@test/repositories/in-memory-stock.repository';
import { UpdateStockUseCase } from './update-stock.usecase';
import { Stock } from '@application/entities/stock';

describe('UpdateStockUseCase', () => {
  it('should update a stock correctly', async () => {
    const repository = new InMemoryStockRepository();
    const updateStock = new UpdateStockUseCase(repository);
    const minus = -10;
    const stock = new Stock({
      productId: 2,
      quantity: 23,
    });
    const expected: Stock = stock;

    repository.stocks.push(stock);
    expected.quantity += minus;
    const actual = await updateStock.execute(stock, minus);

    expect(actual).toBe(expected);
  });

  it('should throw if an invalid quantity is passed', async () => {
    const repository = new InMemoryStockRepository();
    const updateStock = new UpdateStockUseCase(repository);
    const minus = -50;
    const stock = new Stock({
      productId: 2,
      quantity: 23,
    });

    repository.stocks.push(stock);

    await expect(updateStock.execute(stock, minus)).rejects.toThrow(Error);
  });
});
