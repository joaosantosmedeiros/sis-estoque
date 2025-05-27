import { Account } from '@application/entities/account';

export abstract class AccountRepository {
  abstract findById(id: number): Promise<Account | null>;
  abstract findByName(name: string): Promise<Account | null>;
  abstract list(): Promise<Account[]>;
  abstract create(account: Account): Promise<Account>;
  abstract delete(id: number): Promise<void>;
  abstract update(
    id: number,
    props: {
      newName?: string;
      newPassword?: string;
    },
  ): Promise<Account>;
}
