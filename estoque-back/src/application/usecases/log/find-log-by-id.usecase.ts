import { Log } from '@application/entities/log';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';
import { LogRepository } from '@application/repositories/log.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindLogByIdUseCase {
  constructor(private readonly logRepository: LogRepository) {}

  async execute(id: number): Promise<Log> {
    const log = await this.logRepository.findById(id);
    if (!log) throw new EntityNotFoundError('Log');

    return log;
  }
}
