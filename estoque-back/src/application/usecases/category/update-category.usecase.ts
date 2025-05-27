import { Category } from '@application/entities/category';
import { CategoryRepository } from '@application/repositories/category.repository';
import { Injectable } from '@nestjs/common';
import { FindCategoryByNameUseCase } from './find-category-by-name.usecase';
import { EntityAlreadyExistsError } from '@application/errors/entity-already-exists.error';

export interface UpdateCategoryRequest {
  id: number;
  name: string;
  isActive: boolean;
}

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly findCategoryByName: FindCategoryByNameUseCase,
  ) {}

  async execute(request: UpdateCategoryRequest): Promise<Category> {
    const categoryExists = await this.findCategoryByName.execute(request.name);
    if (categoryExists && categoryExists.id != request.id) {
      throw new EntityAlreadyExistsError('Categoria');
    }

    return this.categoryRepository.update(
      request.id,
      request.name,
      request.isActive,
    );
  }
}
