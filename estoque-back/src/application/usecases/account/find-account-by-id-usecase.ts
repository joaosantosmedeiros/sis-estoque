import { Account } from '@application/entities/account';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';
import { AccountRepository } from '@application/repositories/account.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAccountByIdUseCase {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(accountId: number): Promise<Account> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new EntityNotFoundError('Account');
    }
    return account;
  }
}
