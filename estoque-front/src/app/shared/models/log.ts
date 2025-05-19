import { Stock } from "./stock";

export interface Log {
  id: number;
  quantity: number;
  date: Date;
  stock: Stock;
}
