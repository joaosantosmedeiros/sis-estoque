import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '@application/repositories/category.repository';
import { PrismaCategoryMapper } from '../mapper/prisma-category.mapper';
import { Category } from '@application/entities/category';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: number): Promise<Category | null> {
    const raw = await this.prismaService.category.findUnique({
      where: { id },
    });

    return raw ? PrismaCategoryMapper.toDomain(raw) : null;
  }

  async findByName(name: string): Promise<Category | null> {
    const raw = await this.prismaService.category.findFirst({
      where: { name },
    });

    return raw ? PrismaCategoryMapper.toDomain(raw) : null;
  }

  async findContainingName(name: string): Promise<Category[]> {
    const categories = await this.prismaService.category.findMany({
      where: {
        name: {
          mode: 'insensitive',
          contains: name,
        },
      },
    });

    return categories.map((category) =>
      PrismaCategoryMapper.toDomain(category),
    );
  }

  async list(): Promise<Category[]> {
    const categories = await this.prismaService.category.findMany();

    return categories.map((category) =>
      PrismaCategoryMapper.toDomain(category),
    );
  }

  async create(category: Category): Promise<Category> {
    return PrismaCategoryMapper.toDomain(
      await this.prismaService.category.create({
        data: PrismaCategoryMapper.toPrisma(category),
      }),
    );
  }

  async update(id: number, name: string, isActive: boolean): Promise<Category> {
    const raw = await this.prismaService.category.update({
      where: { id },
      data: { name, isActive },
    });

    return PrismaCategoryMapper.toDomain(raw);
  }

  async delete(id: number): Promise<void> {
    await this.prismaService.category.delete({
      where: { id },
    });
  }
}
