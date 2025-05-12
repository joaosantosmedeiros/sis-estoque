import { Injectable } from '@nestjs/common';
import { ProductRepository } from '@application/repositories/product.repository';
import { Product } from '@application/entities/product';

export interface UpdateProductRequest {
  id: number;
  name: string;
  price: number;
  categoryId: number;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(request: UpdateProductRequest): Promise<Product> {
    const { name, categoryId, price } = request;
    return this.productRepository.update(request.id, {
      name,
      categoryId,
      price,
    });
  }
}
