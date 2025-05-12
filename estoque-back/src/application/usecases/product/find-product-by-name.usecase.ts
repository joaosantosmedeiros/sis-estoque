import { Product } from '@application/entities/product';
import { ProductRepository } from '@application/repositories/product.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindProductByNameUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(name: string): Promise<Product[]> {
    return this.productRepository.findAllByName(name);
  }
}
