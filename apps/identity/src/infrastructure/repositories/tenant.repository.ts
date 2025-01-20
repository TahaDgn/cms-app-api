import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Tenant, TenantIssue } from '@prisma/client';
import { PRISMA_SERVICE, TenantRepositorySign } from '../../domain';

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
    payload: Pick<Tenant, 'id' | 'ownerId'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>> {
    const { id, ownerId } = payload;

    return transactionClient.tenant.update({
      where: {
        id,
      },
      data: {
        ownerId,
      },
      include: {
        users: true,
      },
    });
  }

  async incrementClientCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>> {
    const { id } = payload;

    const updatedTenant = await transactionClient.tenant.update({
      where: {
        id,
      },
      data: {
        clientsCount: {
          increment: 1,
        },
      },
      include: {
        users: true,
      },
    });

    const { issues } = updatedTenant;

    if (!issues.includes(TenantIssue.NO_CLIENT_FOUND)) return updatedTenant;

    const modifiedIssues = issues.filter(
      (issue) => issue !== TenantIssue.NO_CLIENT_FOUND,
    );

    return transactionClient.tenant.update({
      where: {
        id,
      },
      data: {
        issues: modifiedIssues,
      },
      include: {
        users: true,
      },
    });
  }

  async incrementParticipantCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>> {
    const { id } = payload;

    const updatedTenant = await transactionClient.tenant.update({
      where: {
        id,
      },
      data: {
        participantsCount: {
          increment: 1,
        },
      },
      include: {
        users: true,
      },
    });

    const { issues } = updatedTenant;

    if (!issues.includes(TenantIssue.NO_PARTICIPANT_FOUND))
      return updatedTenant;

    const modifiedIssues = issues.filter(
      (issue) => issue !== TenantIssue.NO_PARTICIPANT_FOUND,
    );

    return transactionClient.tenant.update({
      where: {
        id,
      },
      data: {
        issues: modifiedIssues,
      },
      include: {
        users: true,
      },
    });
  }
  async decrementClientCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>> {
    const { id } = payload;

    const updatedTenant = await transactionClient.tenant.update({
      where: {
        id,
      },
      data: {
        clientsCount: {
          increment: -1,
        },
      },
      include: {
        users: true,
      },
    });

    const { clientsCount } = updatedTenant;

    if (clientsCount > 0) return updatedTenant;

    return transactionClient.tenant.update({
      where: {
        id,
      },
      data: {
        issues: {
          push: TenantIssue.NO_CLIENT_FOUND,
        },
      },
      include: {
        users: true,
      },
    });
  }
  async decrementParticipantCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>> {
    const { id } = payload;

    const updatedTenant = await transactionClient.tenant.update({
      where: {
        id,
      },
      data: {
        participantsCount: {
          increment: -1,
        },
      },
      include: {
        users: true,
      },
    });

    const { participantsCount } = updatedTenant;

    if (participantsCount > 0) return updatedTenant;

    return transactionClient.tenant.update({
      where: {
        id,
      },
      data: {
        issues: {
          push: TenantIssue.NO_PARTICIPANT_FOUND,
        },
      },
      include: {
        users: true,
      },
    });
  }
  async incrementProjectCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>> {
    const { id } = payload;

    const updatedTenant = await transactionClient.tenant.update({
      where: {
        id,
      },
      data: {
        projectsCount: {
          increment: 1,
        },
      },
      include: {
        users: true,
      },
    });

    const { issues } = updatedTenant;

    if (!issues.includes(TenantIssue.NO_PROJECT_FOUND)) return updatedTenant;

    const modifiedIssues = issues.filter(
      (issue) => issue !== TenantIssue.NO_PROJECT_FOUND,
    );

    return transactionClient.tenant.update({
      where: {
        id,
      },
      data: {
        issues: modifiedIssues,
      },
      include: {
        users: true,
      },
    });
  }
  async decrementProjectCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>> {
    const { id } = payload;

    const updatedTenant = await transactionClient.tenant.update({
      where: {
        id,
      },
      data: {
        clientsCount: {
          increment: -1,
        },
      },
      include: {
        users: true,
      },
    });

    const { projectsCount } = updatedTenant;

    if (projectsCount > 0) return updatedTenant;

    return transactionClient.tenant.update({
      where: {
        id,
      },
      data: {
        issues: {
          push: TenantIssue.NO_PROJECT_FOUND,
        },
      },
      include: {
        users: true,
      },
    });
  }

  update(
    payload: Prisma.TenantUpdateArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>> {
    return transactionClient.tenant.update({
      ...payload,
      include: {
        users: true,
      },
    });
  }

  delete(
    payload: Prisma.TenantDeleteArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>> {
    return transactionClient.tenant.delete({
      ...payload,
      include: {
        users: true,
      },
    });
  }
}
