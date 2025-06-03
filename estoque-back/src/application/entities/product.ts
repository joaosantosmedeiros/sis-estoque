import { Category } from './category';

export interface ProductProps {
  name: string;
  price: number;
  isActive: boolean;
  category?: Category;
  categoryId: number;
}

export class Product {
  private _id?: number;
  private readonly props: ProductProps;

  constructor(props: ProductProps, id?: number) {
    this._id = id ?? undefined;
    this.props = props;
  }

  public get id(): number | undefined {
    return this._id;
  }

  public set id(id: number) {
    this._id = id;
  }

  public get name() {
    return this.props.name;
  }

  public set name(name: string) {
    this.props.name = name;
  }

  public get price() {
    return this.props.price;
  }

  public set price(price: number) {
    this.props.price = price;
  }
  get category(): Category | undefined {
    return this.props.category;
  }

  public set category(category: Category) {
    this.props.category = category;
    if (category.id) this.props.categoryId = category.id;
  }

  public get categoryId(): number {
    return this.props.categoryId;
  }

  public set categoryId(categoryId: number) {
    this.props.categoryId = categoryId;
  }

  public get isActive(): boolean {
    return this.props.isActive;
  }

  public set isActive(isActive: boolean) {
    this.props.isActive = isActive;
  }
}
