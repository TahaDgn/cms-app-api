import { Prisma, Tenant } from '@prisma/client';
import { DeleteTenantPayload } from 'libs/interfaces';

export const TENANT_REPOSITORY = Symbol('TENANT_REPOSITORY');

export interface TenantRepositorySign {
  create(
    payload: Pick<Prisma.TenantCreateInput, 'name' | 'identifier' | 'users'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>>;

  setOwner(
    id: number,
    payload: Pick<Prisma.TenantUpdateInput, 'ownerId'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Tenant>;

  incrementClientCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Tenant>;

  incrementParticipantCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Tenant>;

  decrementClientCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Tenant>;

  decrementParticipantCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Tenant>;

  delete(
    payload: DeleteTenantPayload,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>>;
}
