import { Log } from './log';
import { makeStock } from '@test/factories/stock.factory';

describe('Log', () => {
  it('should be able to create a new log', () => {
    const log = new Log({
      stockId: 0,
      quantity: 25,
      date: new Date(),
      accountId: 1,
    });
    expect(log).toBeTruthy();
  });

  it('should create a new log with correct values', () => {
    const stockId = 0;
    const quantity = 25;
    const date = new Date();
    const id = 2;
    const accountId = 1;

    const log = new Log(
      {
        stockId,
        quantity,
        date,
        accountId,
      },
      id,
    );

    expect(log.id).toBe(id);
    expect(log.stockId).toBe(stockId);
    expect(log.quantity).toBe(quantity);
    expect(log.date).toEqual(date);
  });

  it('should update log with correct values', () => {
    const log = new Log({
      stockId: 0,
      quantity: 25.5,
      date: new Date(),
      accountId: 1,
    });

    const anotherStock = makeStock({});
    anotherStock.id = 23;

    log.id = 1;
    log.quantity = 2;
    log.stock = anotherStock;
    log.stockId = anotherStock.id!;
    log.date = new Date('12/01/2003');

    expect(log.quantity).toBe(2);
    expect(log.stock).toBe(anotherStock);
    expect(log.stockId).toBe(anotherStock.id);
    expect(log.id).toBe(1);
    expect(log.date).toEqual(new Date('12/01/2003'));
  });
});
