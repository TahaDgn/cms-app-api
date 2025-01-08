import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Tenant } from '@prisma/client';
import { PRISMA_SERVICE, TenantRepositorySign } from '../../domain';
import { DeleteTenantPayload } from 'libs/interfaces';

@Injectable()
export class TenantRepository implements TenantRepositorySign {
  constructor(
    @Inject(PRISMA_SERVICE) private readonly prismaService: PrismaService,
  ) {}

  async create(
    payload: Pick<Prisma.TenantCreateInput, 'name' | 'identifier'>,
    transactionClient = this.prismaService,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>> {
    return transactionClient.tenant.create({
      data: {
        ...payload,
      },
      include: {
        users: true,
      },
    });
  }

  async setOwner(
    id: number,
    payload: Pick<Prisma.TenantUpdateInput, 'ownerId'>,
    transactionClient = this.prismaService,
  ): Promise<Tenant> {
    return transactionClient.tenant.update({
      where: { id },
      data: { ...payload },
    });
  }

  async incrementClientCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient = this.prismaService,
  ): Promise<Tenant> {
    const { id } = payload;

    return transactionClient.tenant.update({
      where: { id },
      data: {
        clientsCount: { increment: 1 },
      },
    });
  }

  async incrementParticipantCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient = this.prismaService,
  ): Promise<Tenant> {
    const { id } = payload;

    return transactionClient.tenant.update({
      where: { id },
      data: {
        participantsCount: { increment: 1 },
      },
    });
  }

  async decrementClientCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient = this.prismaService,
  ): Promise<Tenant> {
    const { id } = payload;

    return transactionClient.tenant.update({
      where: { id },
      data: {
        clientsCount: { decrement: 1 },
      },
    });
  }

  async decrementParticipantCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient = this.prismaService,
  ): Promise<Tenant> {
    const { id } = payload;

    return transactionClient.tenant.update({
      where: { id },
      data: {
        participantsCount: { decrement: 1 },
      },
    });
  }

  delete(
    payload: DeleteTenantPayload,
    transactionClient = this.prismaService,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>> {
    const { id } = payload;

    return transactionClient.tenant.delete({
      where: {
        id,
      },
      include: {
        users: true,
      },
    });
  }
}
