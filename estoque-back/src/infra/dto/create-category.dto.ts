import { IsBoolean, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
