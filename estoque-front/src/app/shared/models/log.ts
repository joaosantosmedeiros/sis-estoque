import { Account } from "./account";
import { Stock } from "./stock";

export interface Log {
  id: number;
  quantity: number;
  date: Date;
  stock: Stock;
  account: Account;
}
