import { Category } from '@application/entities/category';

export class ReturnCategoryDto {
  id: number;
  name: string;
  isActive: boolean;

  constructor(category: Category) {
    this.id = category.id!;
    this.name = category.name;
    this.isActive = category.isActive;
  }
}
