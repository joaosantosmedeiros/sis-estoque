import { InMemoryLogRepository } from '@test/repositories/in-memory-log.repository';
import { FindLogByIdUseCase } from './find-log-by-id.usecase';
import { makeLog } from '@test/factories/log.factory';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';

describe('FindLogByIdUsecase', () => {
  it('should find a log corectly', async () => {
    const repository = new InMemoryLogRepository();
    const findLog = new FindLogByIdUseCase(repository);

    await repository.create(makeLog({}));

    const log = await findLog.execute(repository.logs[0].id!);

    expect(log).toEqual(repository.logs[0]);
  });

  it('should throw if no log is found', async () => {
    const repository = new InMemoryLogRepository();
    const findLog = new FindLogByIdUseCase(repository);

    await expect(findLog.execute(-999)).rejects.toThrow(EntityNotFoundError);
  });
});
