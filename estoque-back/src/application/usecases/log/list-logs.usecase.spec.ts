import { InMemoryLogRepository } from '@test/repositories/in-memory-log.repository';
import { ListLogUseCase } from './list-logs.usecase';
import { makeLog } from '@test/factories/log.factory';

describe('ListLogsUseCase', () => {
  it('should list logs correctly', async () => {
    const repository = new InMemoryLogRepository();
    const listLogs = new ListLogUseCase(repository);
    const expected = 2;

    await repository.create(makeLog({}));
    await repository.create(makeLog({}));

    const actual = (await listLogs.execute()).length;

    expect(actual).toBe(expected);
  });

  it('should return an empty list if no log is found', async () => {
    const repository = new InMemoryLogRepository();
    const listLogs = new ListLogUseCase(repository);

    expect(await listLogs.execute()).toEqual([]);
  });
});
