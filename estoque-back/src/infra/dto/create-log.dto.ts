import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateLogDto {
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  stockId: number;

  @IsDateString()
  date: Date;
}
