export interface CategoryProps {
  name: string;
  isActive: boolean;
}

export class Category {
  private _id?: number;
  private readonly props: CategoryProps;

  constructor(props: CategoryProps, id?: number) {
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

  public get isActive(): boolean {
    return this.props.isActive;
  }

  public set isActive(isActive: boolean) {
    this.props.isActive = isActive;
  }
}
