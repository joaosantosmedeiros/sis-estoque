import { AccountRepository } from '@application/repositories/account.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteAccountUseCase {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(id: number): Promise<void> {
    await this.accountRepository.delete(id);
  }
}
