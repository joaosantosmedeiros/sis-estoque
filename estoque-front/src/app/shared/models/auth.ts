import { Account } from './account';

export interface Authentication {
  accessToken: string;
  account: Account;
}
