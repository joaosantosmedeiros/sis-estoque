import { Account } from '@application/entities/account';

export class ReturnAccountDto {
  id: number;
  name: string;
  isActive: boolean;
  userType: number;

  constructor(account: Account) {
    this.id = account.id!;
    this.name = account.name;
    this.isActive = account.isActive;
    this.userType = account.userType;
  }
}
