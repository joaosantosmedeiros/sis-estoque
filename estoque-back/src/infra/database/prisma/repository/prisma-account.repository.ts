import { AccountRepository } from '@application/repositories/account.repository';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { Account } from '@application/entities/account';
import { PrismaAccountMapper } from '../mapper/prisma-account.mapper';

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: number): Promise<Account | null> {
    const raw = await this.prismaService.account.findUnique({
      where: {
        id,
      },
    });

    if (!raw) {
      return null;
    }

    return PrismaAccountMapper.toDomain(raw);
  }

  async findByName(name: string): Promise<Account | null> {
    const raw = await this.prismaService.account.findUnique({
      where: {
        name,
      },
    });

    if (!raw) {
      return null;
    }

    return PrismaAccountMapper.toDomain(raw);
  }

  async list(): Promise<Account[]> {
    const raw = await this.prismaService.account.findMany({});
    return raw.map((account) => PrismaAccountMapper.toDomain(account));
  }

  async create(account: Account): Promise<Account> {
    const raw = PrismaAccountMapper.toPrisma(account);

    return PrismaAccountMapper.toDomain(
      await this.prismaService.account.create({
        data: raw,
      }),
    );
  }

  async delete(id: number): Promise<void> {
    await this.prismaService.account.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }

  async update(
    id: number,
    props: { newName?: string; newPassword?: string },
  ): Promise<Account> {
    const raw = await this.prismaService.account.update({
      where: {
        id,
      },
      data: {
        name: props.newName,
        password: props.newPassword,
      },
    });

    return PrismaAccountMapper.toDomain(raw);
  }
}
