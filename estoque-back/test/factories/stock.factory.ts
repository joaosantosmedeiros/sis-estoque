import { Stock } from '@application/entities/stock';

export function makeStock({
  quantity = 2,
  productId = 1,
}: {
  quantity?: number;
  productId?: number;
}): Stock {
  return new Stock({
    productId,
    quantity,
  }) as Stock;
}
