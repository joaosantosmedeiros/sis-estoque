import { Log } from '@application/entities/log';

export abstract class LogRepository {
  abstract findById(id: number): Promise<Log | null>;
  abstract findByStock(stockId: number): Promise<Log[]>;
  abstract list(): Promise<Log[]>;
  abstract create(log: Log): Promise<Log>;
}
