import { Injectable } from '@nestjs/common';
import { FindAccountByNameUseCase } from './find-account-by-name-usecase';
import { AccountRepository } from '@application/repositories/account.repository';
import { Account } from '@application/entities/account';
import { EntityInUseError } from '@application/errors/entity-in-use.error';

export interface CreateAccountRequest {
  name: string;
  password: string;
}

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly findAccountByName: FindAccountByNameUseCase,
  ) {}

  async execute(request: CreateAccountRequest): Promise<Account> {
    const { name, password } = request;

    const accountExists = await this.findAccountByName
      .execute(name)
      .catch(() => undefined);
    if (accountExists) {
      throw new EntityInUseError('nome');
    }

    const account = new Account({
      name,
      password,
    });

    await this.accountRepository.create(account);

    return account;
  }
}
