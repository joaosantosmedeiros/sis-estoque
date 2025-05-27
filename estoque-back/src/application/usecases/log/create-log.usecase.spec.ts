import { InMemoryLogRepository } from '@test/repositories/in-memory-log.repository';
import { CreateLogRequest, CreateLogUseCase } from './create-log.usecase';
import { Stock } from '@application/entities/stock';

describe('CreateLogUseCase', () => {
  it('should create a log correctly', async () => {
    const repository = new InMemoryLogRepository();
    const createLog = new CreateLogUseCase(repository);
    const request: CreateLogRequest = {
      date: new Date(),
      quantity: 22,
      stock: new Stock({ productId: 0, quantity: 2 }),
      accountId: 1,
    };

    const log = await createLog.execute(request);

    expect(log.date).toEqual(request.date);
    expect(log.quantity).toBe(request.quantity);
    expect(log.stockId).toBe(request.stock.id);
    expect(log.id).toBe(0);
    expect(log.accountId).toBe(1);
  });
});
