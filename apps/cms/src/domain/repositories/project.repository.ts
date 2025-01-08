import { Prisma, Project } from '@prisma/client';

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');

export interface ProjectRepositorySign {
  create(
    payload: Pick<
      Prisma.ProjectCreateInput,
      'title' | 'description' | 'tenantId'
    >,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.UserGetPayload<{ include: { tenant: true } }>>;

  findFirst(
    payload: Prisma.ProjectFindFirstArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Project>;

  findUnique(
    payload: Prisma.ProjectFindUniqueArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Project>;

  findAll(
    payload: Prisma.ProjectFindManyArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Project[]>;

  update(
    payload: Prisma.ProjectUpdateArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.UserGetPayload<{ include: { tenant: true } }>>;

  delete(
    payload: Pick<Prisma.ProjectWhereInput, 'id' | 'tenantId'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Project>;
}
