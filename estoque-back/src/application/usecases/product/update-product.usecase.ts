import { Injectable } from '@nestjs/common';
import { ProductRepository } from '@application/repositories/product.repository';
import { Product } from '@application/entities/product';
import { FindCategoryByIdUseCase } from '../category/find-category-by-id.usecase';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';

export interface UpdateProductRequest {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  isActive: boolean;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly findCategoryByIdUseCase: FindCategoryByIdUseCase,
  ) {}

  async execute(request: UpdateProductRequest): Promise<Product> {
    const { name, categoryId, price, isActive } = request;

    const category = await this.findCategoryByIdUseCase.execute(
      request.categoryId,
    );

    if (!category?.isActive) throw new EntityNotFoundError('Cateogria');

    return this.productRepository.update(request.id, {
      name,
      categoryId,
      price,
      isActive,
    });
  }
}
