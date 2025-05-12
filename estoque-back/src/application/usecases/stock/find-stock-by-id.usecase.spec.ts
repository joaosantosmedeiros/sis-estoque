import { InMemoryStockRepository } from '@test/repositories/in-memory-stock.repository';
import { FindStockByIdUseCase } from './find-stock-by-id.usecase';
import { makeStock } from '@test/factories/stock.factory';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';

describe('FindStockByIdUseCase', () => {
  it('should find a stock correctly', async () => {
    const repository = new InMemoryStockRepository();
    const findStock = new FindStockByIdUseCase(repository);

    await repository.create(makeStock({}));

    const foundStock = await findStock.execute(repository.stocks[0].id!);

    expect(foundStock).toBe(repository.stocks[0]);
  });

  it('should throw if no stock is found', async () => {
    const repository = new InMemoryStockRepository();
    const findStock = new FindStockByIdUseCase(repository);

    await expect(findStock.execute(-99)).rejects.toThrow(EntityNotFoundError);
  });
});
