import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateStockDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;
}
