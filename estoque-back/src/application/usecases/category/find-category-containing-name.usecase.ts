import { Category } from '@application/entities/category';
import { CategoryRepository } from '@application/repositories/category.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindCategoryContainingNameUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(name: string): Promise<Category[]> {
    return this.categoryRepository.findContainingName(name);
  }
}
