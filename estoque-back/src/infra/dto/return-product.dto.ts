import { Product } from '@application/entities/product';
import { ReturnCategoryDto } from './return-category.dto';

export class ReturnProductDto {
  id: number;
  name: string;
  price: number;
  isActive: boolean;
  category?: ReturnCategoryDto;

  constructor(product: Product) {
    this.id = product.id!;
    this.name = product.name;
    this.price = product.price;
    this.isActive = product.isActive;
    this.category = product.category
      ? new ReturnCategoryDto(product.category)
      : undefined;
  }
}
