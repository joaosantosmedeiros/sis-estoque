import { Product, ProductProps } from '@application/entities/product';
import { ProductRepository } from '@application/repositories/product.repository';
import { PrismaService } from '../prisma.service';
import { PrismaProductMapper } from '../mapper/prisma-product.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: number): Promise<Product | null> {
    const raw = await this.prismaService.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });

    return raw ? PrismaProductMapper.toDomain(raw) : null;
  }

  async findAllByName(name: string): Promise<Product[]> {
    return (
      await this.prismaService.product.findMany({
        where: {
          name: {
            contains: name,
          },
        },
        include: {
          category: true,
        },
      })
    ).map((rawProduct) => PrismaProductMapper.toDomain(rawProduct));
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return (
      await this.prismaService.product.findMany({
        where: {
          categoryId,
        },
        include: {
          category: true,
        },
      })
    ).map((rawProduct) => PrismaProductMapper.toDomain(rawProduct));
  }

  async list(): Promise<Product[]> {
    return (
      await this.prismaService.product.findMany({
        include: {
          category: true,
        },
        orderBy: [{ id: 'asc' }],
      })
    ).map((rawProduct) => PrismaProductMapper.toDomain(rawProduct));
  }

  async create(product: Product): Promise<Product> {
    const raw = await this.prismaService.product.create({
      data: PrismaProductMapper.toPrisma(product),
      include: {
        category: true,
      },
    });

    return PrismaProductMapper.toDomain(raw);
  }

  async update(id: number, props: ProductProps): Promise<Product> {
    const product = new Product(props, id);
    const raw = await this.prismaService.product.update({
      where: {
        id,
      },
      data: PrismaProductMapper.toPrisma(product),
      include: {
        category: true,
      },
    });

    return PrismaProductMapper.toDomain(raw);
  }

  async delete(id: number): Promise<void> {
    await this.prismaService.product.delete({
      where: {
        id,
      },
    });
  }
}
