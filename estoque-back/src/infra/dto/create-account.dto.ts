import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateAccountBody {
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @MinLength(8)
  confirmPassword: string;

  @IsNotEmpty()
  @MinLength(5)
  name: string;
}
