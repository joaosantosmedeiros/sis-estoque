import { Injectable } from '@nestjs/common';
import { FindAccountByNameUseCase } from './find-account-by-name-usecase';
import { AccountRepository } from '@application/repositories/account.repository';
import { Account } from '@application/entities/account';
import { EntityInUseError } from '@application/errors/entity-in-use.error';

export interface UpdateAccountRequest {
  id: number;
  password?: string;
  name?: string;
}

@Injectable()
export class UpdateAccountUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly findAccountByName: FindAccountByNameUseCase,
  ) {}

  async execute(request: UpdateAccountRequest): Promise<Account> {
    if (request.name) {
      const nameIsInUse = await this.findAccountByName
        .execute(request.name)
        .catch(() => undefined);

      if (nameIsInUse && nameIsInUse.id != request.id) {
        throw new EntityInUseError('nome');
      }
    }

    return this.accountRepository.update(request.id, {
      newName: request.name,
      newPassword: request.password,
    });
  }
}
