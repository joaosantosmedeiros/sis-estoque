import { Log } from '@application/entities/log';
import { Stock } from '@application/entities/stock';
import { LogRepository } from '@application/repositories/log.repository';
import { Injectable } from '@nestjs/common';

export interface CreateLogRequest {
  date: Date;
  quantity: number;
  stock: Stock;
  accountId: number;
}

@Injectable()
export class CreateLogUseCase {
  constructor(private readonly logRepository: LogRepository) {}

  async execute(request: CreateLogRequest): Promise<Log> {
    const log: Log = new Log({
      date: new Date(request.date),
      quantity: request.quantity,
      stockId: request.stock.id!,
      accountId: request.accountId,
    });

    return this.logRepository.create(log);
  }
}
