import { Log } from '@application/entities/log';
import { LogRepository } from '@application/repositories/log.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindLogByStock {
  constructor(private readonly logRepository: LogRepository) {}

  async execute(stockId: number): Promise<Log[]> {
    return this.logRepository.findByStock(stockId);
  }
}
