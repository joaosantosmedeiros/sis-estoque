import { ProductRepository } from '@application/repositories/product.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteProductUsecase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: number): Promise<void> {
    return this.productRepository.delete(id);
  }
}
