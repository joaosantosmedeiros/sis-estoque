import { PrismaService } from '../prisma.service';
import { PrismaLogMapper } from '../mapper/prisma-log.mapper';
import { Injectable } from '@nestjs/common';
import { LogRepository } from '@application/repositories/log.repository';
import { Log } from '@application/entities/log';

@Injectable()
export class PrismaLogRepository implements LogRepository {
  constructor(private prismaService: PrismaService) {}

  async findById(id: number): Promise<Log | null> {
    const raw = await this.prismaService.log.findUnique({
      where: {
        id,
      },
      include: {
        stock: true,
      },
    });

    return raw ? PrismaLogMapper.toDomain(raw) : null;
  }

  async findByStock(stockId: number): Promise<Log[]> {
    return (
      await this.prismaService.log.findMany({
        where: {
          stockId,
        },
        include: {
          stock: true,
        },
      })
    ).map((prismaLog) => PrismaLogMapper.toDomain(prismaLog));
  }

  async list(): Promise<Log[]> {
    return (
      await this.prismaService.log.findMany({
        include: {
          stock: true,
        },
        orderBy: [{ id: 'asc' }],
      })
    ).map((prismaLog) => PrismaLogMapper.toDomain(prismaLog));
  }

  async create(log: Log): Promise<Log> {
    const raw = await this.prismaService.log.create({
      data: PrismaLogMapper.toPrisma(log),
      include: {
        stock: true,
      },
    });

    return PrismaLogMapper.toDomain(raw);
  }
}
