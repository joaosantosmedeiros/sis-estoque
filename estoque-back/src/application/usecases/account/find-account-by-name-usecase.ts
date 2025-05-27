import { Account } from '@application/entities/account';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';
import { AccountRepository } from '@application/repositories/account.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAccountByNameUseCase {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(name: string): Promise<Account> {
    const account = await this.accountRepository.findByName(name);
    if (!account?.isActive) {
      throw new EntityNotFoundError('Conta');
    }

    return account;
  }
}
