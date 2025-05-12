import { Product, ProductProps } from '@application/entities/product';
import { ProductRepository } from '@application/repositories/product.repository';

export class InMemoryProductRepository implements ProductRepository {
  public products: Product[] = [];
  public static count = 0;

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.products.filter((product) => product.categoryId == categoryId);
  }

  async findById(id: number): Promise<Product | null> {
    return this.products.find((product) => product.id === id) || null;
  }

  async findAllByName(name: string): Promise<Product[]> {
    return this.products.filter((product) => product.name.includes(name));
  }

  async list(): Promise<Product[]> {
    return this.products;
  }

  async create(newProduct: Product): Promise<Product> {
    newProduct.id = InMemoryProductRepository.count;
    InMemoryProductRepository.count++;
    this.products.push(newProduct);

    return newProduct;
  }

  async update(id: number, props: ProductProps): Promise<Product> {
    const index = this.products.findIndex((product) => product.id === id);
    if (index == -1) {
      throw new Error('Product not found');
    }

    this.products[index].name = props.name;
    this.products[index].price = props.price;
    this.products[index].categoryId = props.categoryId;

    return this.products[index];
  }

  async delete(id: number): Promise<void> {
    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) {
      throw new Error('Product not found');
    }

    this.products.splice(index, 1);
  }
}
