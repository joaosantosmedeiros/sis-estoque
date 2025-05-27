import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateAccountBody {
  password: string;

  confirmPassword: string;

  @IsNotEmpty()
  @MinLength(5)
  name: string;
}
