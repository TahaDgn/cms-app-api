import { Prisma, User } from '@prisma/client';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepositorySign {
  create(
    payload: Prisma.UserCreateArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.UserGetPayload<{ include: { tenant: true } }>>;

  findFirst(
    payload: Prisma.UserFindFirstArgs,
  ): Promise<Prisma.UserGetPayload<{ include: { tenant: true } }>>;

  findUnique(
    payload: Prisma.UserFindUniqueArgs,
  ): Promise<Prisma.UserGetPayload<{ include: { tenant: true } }>>;

  findAll(
    payload: Prisma.UserFindManyArgs,
  ): Promise<Prisma.UserGetPayload<{ include: { tenant: true } }>[]>;

  removeFirstLoginIssue(
    payload: Pick<User, 'id' | 'tenantId'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.UserGetPayload<{ include: { tenant: true } }>>;

  delete(
    payload: Prisma.UserDeleteArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.UserGetPayload<{ include: { tenant: true } }>>;

  count(payload: Prisma.UserCountArgs): Promise<number>;
}
