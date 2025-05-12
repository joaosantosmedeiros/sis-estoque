import { Log } from '@application/entities/log';
import { LogRepository } from '@application/repositories/log.repository';

export class InMemoryLogRepository implements LogRepository {
  public logs: Log[] = [];
  public static count = 0;

  async findById(id: number): Promise<Log | null> {
    const stock = this.logs.find((stock) => stock.id === id);
    return stock ?? null;
  }

  async findByStock(stockId: number): Promise<Log[]> {
    return this.logs.filter((stock) => stock.stockId == stockId);
  }

  async list(): Promise<Log[]> {
    return this.logs;
  }

  async create(newLog: Log): Promise<Log> {
    newLog.id = InMemoryLogRepository.count;
    InMemoryLogRepository.count++;
    this.logs.push(newLog);

    return newLog;
  }
}
