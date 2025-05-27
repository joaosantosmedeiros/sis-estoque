import { Account } from '@application/entities/account';
import { Account as RawAccount } from '@prisma/client';

export class PrismaAccountMapper {
  static toPrisma(account: Account) {
    return {
      id: account.id,
      password: account.password,
      name: account.name,
      userType: account.userType,
      isActive: account.isActive,
    };
  }

  static toDomain(raw: RawAccount) {
    return new Account(
      {
        name: raw.name,
        password: raw.password,
        userType: raw.userType,
        isActive: raw.isActive,
      },
      raw.id,
    );
  }
}
