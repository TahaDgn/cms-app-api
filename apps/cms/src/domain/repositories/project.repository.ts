import { Prisma, Project } from '@prisma/client';

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');

export interface ProjectRepositorySign {
  create(
    payload: Pick<
      Prisma.ProjectCreateInput,
      'title' | 'description' | 'tenantId'
    >,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Project>;

  findFirst(
    payload: Prisma.ProjectWhereInput,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>>;

  findUnique(
    payload: Prisma.ProjectWhereUniqueInput,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>>;

  findAll(
    payload: Prisma.ProjectWhereInput,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>[]>;

  update(
    id: number,
    payload: Prisma.ProjectUpdateInput,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>>;

  delete(
    payload: Pick<Prisma.ProjectWhereInput, 'id' | 'tenantId'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>>;
}
