import { Product, ProductProps } from '@application/entities/product';

export abstract class ProductRepository {
  abstract findById(id: number): Promise<Product | null>;
  abstract findAllByName(name: string): Promise<Product[]>;
  abstract findByCategory(categoryId: number): Promise<Product[]>;
  abstract list(): Promise<Product[]>;
  abstract create(product: Product): Promise<Product>;
  abstract update(id: number, props: ProductProps): Promise<Product>;
  abstract delete(id: number): Promise<void>;
}
