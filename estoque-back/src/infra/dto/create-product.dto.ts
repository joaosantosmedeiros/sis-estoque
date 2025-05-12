import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;
}
