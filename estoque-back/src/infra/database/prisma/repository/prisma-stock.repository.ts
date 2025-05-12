import { PrismaService } from '../prisma.service';
import { PrismaStockMapper } from '../mapper/prisma-stock.mapper';
import { Injectable } from '@nestjs/common';
import { StockRepository } from '@application/repositories/stock.repository';
import { Stock } from '@application/entities/stock';

@Injectable()
export class PrismaStockRepository implements StockRepository {
  constructor(private prismaService: PrismaService) {}

  async findById(id: number): Promise<Stock | null> {
    const raw = await this.prismaService.stock.findUnique({
      where: {
        id,
      },
      include: {
        product: true,
      },
    });

    return raw ? PrismaStockMapper.toDomain(raw) : null;
  }

  async findByProduct(productId: number): Promise<Stock | null> {
    const raw = await this.prismaService.stock.findUnique({
      where: {
        productId,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    return raw ? PrismaStockMapper.toDomain(raw) : null;
  }

  async list(): Promise<Stock[]> {
    return (
      await this.prismaService.stock.findMany({
        include: {
          product: true,
        },
        orderBy: [{ id: 'asc' }],
      })
    ).map((raw) => PrismaStockMapper.toDomain(raw));
  }

  async create(stock: Stock): Promise<Stock> {
    const raw = await this.prismaService.stock.create({
      data: PrismaStockMapper.toPrisma(stock),
      include: {
        product: true,
      },
    });

    return PrismaStockMapper.toDomain(raw);
  }

  async update(id: number, quantity: number): Promise<Stock> {
    const raw = await this.prismaService.stock.update({
      where: {
        id,
      },
      data: {
        quantity,
      },
      include: {
        product: true,
      },
    });

    return PrismaStockMapper.toDomain(raw);
  }

  async delete(id: number): Promise<void> {
    await this.prismaService.stock.delete({
      where: {
        id,
      },
    });
  }
}
