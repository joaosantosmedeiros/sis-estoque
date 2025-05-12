import { Product } from '@application/entities/product';
import { ProductRepository } from '@application/repositories/product.repository';
import { Injectable } from '@nestjs/common';

export interface CreateProductRequest {
  name: string;
  price: number;
  categoryId: number;
}

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}
  async execute(request: CreateProductRequest): Promise<Product> {
    const { categoryId, name, price } = request;
    const product = new Product({
      name,
      price,
      categoryId,
    });

    return this.productRepository.create(product);
  }
}
