import { InMemoryLogRepository } from '@test/repositories/in-memory-log.repository';
import { makeLog } from '@test/factories/log.factory';
import { FindLogByStock } from './find-log-by-stock.usecase';

describe('FindLogByStockUsecase', () => {
  it('should find logs corectly', async () => {
    const repository = new InMemoryLogRepository();
    const findLog = new FindLogByStock(repository);
    const stockId = 2;

    await repository.create(makeLog({ stockId }));
    await repository.create(makeLog({ stockId }));

    const logs = await findLog.execute(stockId);

    expect(logs).toEqual(repository.logs);
  });

  it('should throw if no log is found', async () => {
    const repository = new InMemoryLogRepository();
    const findLog = new FindLogByStock(repository);

    expect(await findLog.execute(-999)).toEqual([]);
  });
});
