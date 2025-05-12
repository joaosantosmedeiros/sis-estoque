import { Stock } from '@application/entities/stock';

export interface LogProps {
  date: Date;
  stockId: number;
  stock?: Stock;
  quantity: number;
}

export class Log {
  private _id?: number;
  private props: LogProps;

  constructor(props: LogProps, id?: number) {
    this._id = id ?? undefined;
    this.props = props;
  }

  public get id(): number | undefined {
    return this._id;
  }

  public set id(id: number) {
    this._id = id;
  }

  public get stock(): Stock | undefined {
    return this.props.stock;
  }

  public set stock(stock: Stock) {
    this.props.stock = stock;
    if (stock.id) this.props.stockId = stock.id;
  }

  public get stockId(): number {
    return this.props.stockId;
  }

  public set stockId(stockId: number) {
    this.props.stockId = stockId;
  }

  public get quantity(): number {
    return this.props.quantity;
  }

  public set quantity(quantity: number) {
    this.props.quantity = quantity;
  }

  public get date(): Date {
    return this.props.date;
  }

  public set date(date: Date) {
    this.props.date = date;
  }
}
