import { Account } from '@application/entities/account';

export class LoginPayload {
  id: number;
  userType: number;

  constructor(account: Account) {
    this.id = account.id!;
    this.userType = account.userType;
  }
}
