import { Product } from './product';

export interface StockProps {
  quantity: number;
  product?: Product;
  productId: number;
}

export class Stock {
  private _id?: number;
  private readonly props: StockProps;

  constructor(props: StockProps, id?: number) {
    this._id = id ?? undefined;
    this.props = props;
  }

  public get id(): number | undefined {
    return this._id;
  }

  public set id(id: number) {
    this._id = id;
  }

  public get product(): Product | undefined {
    return this.props.product;
  }

  public set product(product: Product) {
    this.props.product = product;
    if (product.id) this.props.productId = product.id;
  }

  public get productId(): number {
    return this.props.productId;
  }

  public set productId(productId: number) {
    this.props.productId = productId;
  }

  public get quantity(): number {
    return this.props.quantity;
  }

  public set quantity(quantity: number) {
    this.props.quantity = quantity;
  }
}
