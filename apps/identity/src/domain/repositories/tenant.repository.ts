import { Prisma, Tenant } from '@prisma/client';

export const TENANT_REPOSITORY = Symbol('TENANT_REPOSITORY');

export interface TenantRepositorySign {
  create(
    payload: Prisma.TenantCreateInput,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>>;

  setOwner(
    payload: Pick<Tenant, 'id' | 'ownerId'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>>;

  incrementClientCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>>;

  incrementParticipantCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>>;

  decrementClientCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>>;

  decrementParticipantCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>>;

  incrementProjectCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>>;

  decrementProjectCount(
    payload: Pick<Tenant, 'id'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>>;

  update(
    payload: Prisma.TenantUpdateArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>>;

  delete(
    payload: Prisma.TenantDeleteArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.TenantGetPayload<{ include: { users: true } }>>;
}
