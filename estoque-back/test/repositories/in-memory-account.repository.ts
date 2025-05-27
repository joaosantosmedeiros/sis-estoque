import { Account } from '@application/entities/account';
import { EntityInUseError } from '@application/errors/entity-in-use.error';
import { AccountRepository } from '@application/repositories/account.repository';

export class InMemoryAccountRepository implements AccountRepository {
  public accounts: Account[] = [];

  async findById(id: number): Promise<Account | null> {
    return this.accounts.find((acc) => acc.id === id) || null;
  }

  async findByName(name: string): Promise<Account | null> {
    return this.accounts.find((acc) => acc.name === name) || null;
  }

  async list(includeInactives?: boolean): Promise<Account[]> {
    if (!includeInactives) return this.accounts.filter((acc) => acc.isActive);
    return this.accounts;
  }

  async create(account: Account): Promise<Account> {
    if (this.accounts.filter((acc) => acc.name === account.name).length > 0) {
      throw new EntityInUseError('nome');
    }
    this.accounts.push(account);
    return account;
  }

  async update(
    id: number,
    props: {
      newName?: string;
      newPassword?: string;
    },
  ): Promise<Account> {
    const account = this.accounts.find((acc) => acc.id === id);

    if (!account) {
      throw new Error('Account not found');
    }

    if (this.accounts.find((acc) => acc.name == props.newName))
      throw new EntityInUseError('nome');

    account.password = props.newPassword ?? account.password;
    account.name = props.newName ?? account.name;

    return account;
  }

  async delete(id: number): Promise<void> {
    const index = this.accounts.findIndex((acc) => acc.id === id);

    if (index === -1) {
      throw new Error('Account not found');
    }

    this.accounts.splice(index, 1);
  }
}
