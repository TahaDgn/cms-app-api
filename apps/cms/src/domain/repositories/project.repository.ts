import { Prisma } from '@prisma/client';

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');

export interface ProjectRepositorySign {
  create(
    payload: Prisma.ProjectCreateArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>>;

  findFirst(
    payload: Prisma.ProjectFindFirstArgs,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>>;

  findUnique(
    payload: Prisma.ProjectFindUniqueArgs,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>>;

  findAll(
    payload: Prisma.ProjectFindManyArgs,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>[]>;

  update(
    payload: Prisma.ProjectUpdateArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>>;

  count(payload: Prisma.ProjectCountArgs): Promise<number>;

  delete(
    payload: Prisma.ProjectDeleteArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>>;
}
