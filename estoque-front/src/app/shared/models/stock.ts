import { Product } from "./product";

export interface Stock {
  id: number;
  quantity: number;
  product: Product;
}