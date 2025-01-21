import { Inject, Injectable } from '@nestjs/common';
import {
  PRISMA_SERVICE,
  PrismaServiceSign,
  PROJECT_REPOSITORY,
  ProjectNotFoundException,
  ProjectRepositorySign,
} from '../../domain';
import { CacheUseCase } from './cache.use-case';
import {
  AddClientsToProjectsPayload,
  AuthorizedUserPayload,
  CreateProjectPayload,
  DeleteProjectPayload,
  GetProjectPayload,
  GetProjectResponse,
  ListProjectsPayload,
  ListProjectsResponse,
  RemoveClientsFromProjectsPayload,
  UpdateProjectPayload,
} from 'libs/interfaces';
import { Prisma, UserType } from '@prisma/client';
import { some, uniq } from 'lodash';

@Injectable()
export class ProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositorySign,
    @Inject(PRISMA_SERVICE)
    private readonly prismaService: PrismaServiceSign,
    private readonly cacheUseCase: CacheUseCase,
  ) {}

  public async create(
    payload: CreateProjectPayload,
    user: AuthorizedUserPayload,
  ) {
    const { tenantId } = user;

    return this.projectRepository.create({
      data: {
        ...payload,
        tenantId,
      },
      include: {
        tickets: true,
      },
    });
  }

  public async update(
    payload: UpdateProjectPayload,
    user: AuthorizedUserPayload,
  ) {
    const { id, ...restOfUpdatePayload } = payload;

    const { tenantId } = user;

    return this.projectRepository.update({
      where: {
        id,
        tenantId,
      },
      data: {
        ...restOfUpdatePayload,
      },
      include: {
        tickets: true,
      },
    });
  }

  public async list(
    payload: ListProjectsPayload,
    user: AuthorizedUserPayload,
  ): Promise<ListProjectsResponse> {
    const { where, skip, take } = payload;

    const { id: possibleClientId, tenantId, type } = user;

    const clientQuery: Pick<Prisma.ProjectWhereInput, 'clientUserIds'> =
      type === UserType.CLIENT
        ? {
            clientUserIds: {
              has: possibleClientId,
            },
          }
        : {
            clientUserIds: undefined,
          };

    const projects = await this.projectRepository.findAll({
      where: {
        ...where,
        ...clientQuery,
        tenantId,
      },
      skip: skip ? skip : undefined,
      take: take ? take : undefined,
    });

    const totalItemsCount = await this.projectRepository.count({
      where,
    });

    return {
      projects,
      totalItemsCount,
    };
  }

  public async getOrFail(
    payload: GetProjectPayload,
    user: AuthorizedUserPayload,
  ): Promise<GetProjectResponse> {
    const { where } = payload;

    const { id: possibleClientId, tenantId, type } = user;

    const clientQuery: Pick<Prisma.ProjectWhereInput, 'clientUserIds'> =
      type === UserType.CLIENT
        ? {
            clientUserIds: {
              has: possibleClientId,
            },
          }
        : {
            clientUserIds: undefined,
          };

    const project = await this.projectRepository.findFirst({
      where: {
        ...where,
        ...clientQuery,
        tenantId,
      },
      include: {
        tickets: true,
      },
    });

    if (!project) throw new ProjectNotFoundException();

    return project;
  }

  public async addClientsToProjects(
    payload: AddClientsToProjectsPayload,
    user: AuthorizedUserPayload,
  ): Promise<ListProjectsResponse> {
    const { clientUserIds: clientUserIdsToAdd, ids } = payload;

    const { tenantId } = user;

    const projectListResponse = await this.prismaService.$transaction(
      async (transactionClient: Prisma.TransactionClient) => {
        const projects = await Promise.all(
          ids.map(async (id) => {
            const { clientUserIds } = await this.projectRepository.findFirst({
              where: {
                id,
                tenantId,
              },
            });

            const modifiedClientUserIds = [
              ...clientUserIds,
              ...clientUserIdsToAdd,
            ];

            return this.projectRepository.update(
              {
                where: {
                  id,
                  tenantId,
                },
                data: {
                  clientUserIds: uniq(modifiedClientUserIds),
                },
              },
              transactionClient,
            );
          }),
        );

        return {
          projects,
          totalItemsCount: projects.length,
        };
      },
    );

    return projectListResponse;
  }

  public async removeClientsFromProjects(
    payload: RemoveClientsFromProjectsPayload,
    user: AuthorizedUserPayload,
  ): Promise<ListProjectsResponse> {
    const { clientUserIds: clientUserIdsToRemove, ids } = payload;

    const { tenantId } = user;

    const projectListResponse = await this.prismaService.$transaction(
      async (transactionClient: Prisma.TransactionClient) => {
        const projects = await Promise.all(
          ids.map(async (id) => {
            const { clientUserIds } = await this.projectRepository.findFirst({
              where: {
                id,
                tenantId,
              },
            });

            const modifiedClientUserIds = clientUserIds.filter((clientUserId) =>
              some(clientUserIdsToRemove, clientUserId),
            );

            return this.projectRepository.update(
              {
                where: {
                  id,
                  tenantId,
                },
                data: {
                  clientUserIds: uniq(modifiedClientUserIds),
                },
              },
              transactionClient,
            );
          }),
        );

        return {
          projects,
          totalItemsCount: projects.length,
        };
      },
    );

    return projectListResponse;
  }

  public async delete(
    payload: DeleteProjectPayload,
    user: AuthorizedUserPayload,
  ): Promise<GetProjectResponse> {
    const { tenantId } = user;

    return this.projectRepository.delete({
      where: {
        ...payload,
        tenantId,
      },
      include: {
        tickets: true,
      },
    });
  }
}
