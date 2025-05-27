import { Category } from '@application/entities/category';
import { CategoryRepository } from '@application/repositories/category.repository';
import { Injectable } from '@nestjs/common';
import { FindCategoryByNameUseCase } from './find-category-by-name.usecase';
import { EntityAlreadyExistsError } from '@application/errors/entity-already-exists.error';

export interface CreateCategoryRequest {
  name: string;
  isActive: boolean;
}

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly findCategoryByName: FindCategoryByNameUseCase,
  ) {}

  async execute(request: CreateCategoryRequest): Promise<Category> {
    const { name, isActive } = request;

    const categoryExists = await this.findCategoryByName.execute(name);
    if (categoryExists) {
      throw new EntityAlreadyExistsError('Categoria');
    }

    const category = new Category({
      name,
      isActive,
    });

    return this.categoryRepository.create(category);
  }
}
