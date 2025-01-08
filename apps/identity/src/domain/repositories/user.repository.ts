import { Prisma } from '@prisma/client';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepositorySign {
  create(
    payload: Pick<Prisma.UserCreateInput, 'email' | 'name' | 'type' | 'tenant'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.UserGetPayload<{ include: { tenant: true } }>>;

  findFirst(
    payload: Prisma.UserFindFirstArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.UserGetPayload<{ include: { tenant: true } }>>;

  findUnique(
    payload: Prisma.UserFindUniqueArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.UserGetPayload<{ include: { tenant: true } }>>;

  findAll(
    payload: Prisma.UserFindManyArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.UserGetPayload<{ include: { tenant: true } }>[]>;

  removeFirstLoginIssue(
    payload: Pick<Prisma.UserWhereUniqueInput, 'id' | 'tenantId'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<void>;

  delete(
    payload: Pick<Prisma.UserWhereInput, 'id' | 'tenantId'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.UserGetPayload<{ include: { tenant: true } }>>;
}
