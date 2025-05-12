import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateStockDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;
}
