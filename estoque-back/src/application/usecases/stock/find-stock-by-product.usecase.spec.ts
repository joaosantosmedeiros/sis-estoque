import { InMemoryStockRepository } from '@test/repositories/in-memory-stock.repository';
import { FindStockByProductUseCase } from './find-stock-by-product.usecase';
import { makeStock } from '@test/factories/stock.factory';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';

describe('FindStockByProductUseCase', () => {
  it('should find a stock correctly', async () => {
    const repository = new InMemoryStockRepository();
    const findStock = new FindStockByProductUseCase(repository);

    repository.stocks.push(
      makeStock({ productId: 1 }),
      makeStock({ productId: 2 }),
    );

    const stock = await findStock.execute(1);

    expect(stock).toBe(repository.stocks[0]);
  });

  it('should throw if no stock is found', async () => {
    const repository = new InMemoryStockRepository();
    const findStock = new FindStockByProductUseCase(repository);

    repository.stocks.push(
      makeStock({ productId: 1 }),
      makeStock({ productId: 2 }),
    );

    await expect(findStock.execute(-999)).rejects.toThrow(EntityNotFoundError);
  });
});
