import { Product } from '@application/entities/product';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';
import { ProductRepository } from '@application/repositories/product.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: number): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new EntityNotFoundError('Produto');
    }
    return product;
  }
}
