import { Log } from '@application/entities/log';

export function makeLog({
  quantity = 2,
  stockId = 1,
  date = new Date(),
  accountId = 1,
}: {
  quantity?: number;
  stockId?: number;
  date?: Date;
  accountId?: number;
}): Log {
  return new Log({
    stockId,
    quantity,
    date,
    accountId,
  });
}
