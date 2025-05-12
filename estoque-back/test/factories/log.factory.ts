import { Log } from '@application/entities/log';

export function makeLog({
  quantity = 2,
  stockId = 1,
  date = new Date(),
}: {
  quantity?: number;
  stockId?: number;
  date?: Date;
}): Log {
  return new Log({
    stockId,
    quantity,
    date,
  }) as Log;
}
