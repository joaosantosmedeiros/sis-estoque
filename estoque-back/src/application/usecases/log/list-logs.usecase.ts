import { Log } from '@application/entities/log';
import { LogRepository } from '@application/repositories/log.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListLogUseCase {
  constructor(private readonly repository: LogRepository) {}

  async execute(): Promise<Log[]> {
    return this.repository.list();
  }
}
