import { Product } from '@application/entities/product';
import { ProductRepository } from '@application/repositories/product.repository';
import { Injectable } from '@nestjs/common';
import { FindCategoryByIdUseCase } from '../category/find-category-by-id.usecase';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';

export interface CreateProductRequest {
  name: string;
  price: number;
  categoryId: number;
  isActive: boolean;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly findCategoryByIdUseCase: FindCategoryByIdUseCase,
  ) {}

  async execute(request: CreateProductRequest): Promise<Product> {
    const category = await this.findCategoryByIdUseCase.execute(
      request.categoryId,
    );

    if (!category?.isActive) throw new EntityNotFoundError('Cateogria');

    const { isActive, categoryId, name, price } = request;
    const product = new Product({
      name,
      price,
      categoryId,
      isActive,
    });

    return this.productRepository.create(product);
  }
}
