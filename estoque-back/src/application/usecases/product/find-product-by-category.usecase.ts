import { Product } from '@application/entities/product';
import { ProductRepository } from '@application/repositories/product.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindProductByCategory {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(categoryId: number): Promise<Product[]> {
    return this.productRepository.findByCategory(categoryId);
  }
}
