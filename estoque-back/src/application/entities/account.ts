export interface AccountProps {
  name: string;
  password: string;
  userType: number;
  isActive: boolean;
}

export interface AccountPropsDto {
  name: string;
  password: string;
  userType?: number;
  isActive?: boolean;
}

export class Account {
  private _id?: number;
  private readonly props: AccountProps;

  constructor(props: AccountPropsDto, id?: number) {
    if (props.name.length < 5) {
      throw new Error('Name length must be greater than 4 characters');
    }
    if (props.password.length < 8) {
      throw new Error('Password length must be greater than 8 characters');
    }
    if (props.userType && props.userType != 0 && props.userType != 1)
      throw new Error('UserType must be 0 or 1');

    this._id = id ?? undefined;
    this.props = {
      ...props,
      isActive: props.isActive ?? true,
      userType: props.userType ?? 1,
    };
  }

  public get id(): number | undefined {
    return this._id;
  }
  public set id(id: number) {
    this._id = id;
  }

  public get name(): string {
    return this.props.name;
  }
  public set name(name: string) {
    this.props.name = name;
  }

  public get password(): string {
    return this.props.password;
  }
  public set password(password: string) {
    this.props.password = password;
  }

  public get userType(): number {
    return this.props.userType;
  }

  public get isActive(): boolean {
    return this.props.isActive;
  }
  public set isActive(isActive: boolean) {
    this.props.isActive = isActive;
  }
}
