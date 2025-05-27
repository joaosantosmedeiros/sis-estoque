import { Account } from '@application/entities/account';
import { AccountRepository } from '@application/repositories/account.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListAccountsUseCase {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(): Promise<Account[]> {
    return this.accountRepository.list();
  }
}
