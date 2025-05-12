import { InMemoryStockRepository } from '@test/repositories/in-memory-stock.repository';
import { ListStockUseCase } from './list-stock.usecase';
import { makeStock } from '@test/factories/stock.factory';

describe('ListStocksUseCase', () => {
  it('should list stocks correctly', async () => {
    const repository = new InMemoryStockRepository();
    const listUseCase = new ListStockUseCase(repository);
    const expected = 2;

    await repository.create(makeStock({ productId: 1 }));
    await repository.create(makeStock({ productId: 2 }));

    const actual = (await listUseCase.execute()).length;

    expect(actual).toBe(expected);
  });
});
