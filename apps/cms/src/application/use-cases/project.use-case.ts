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
  AddClientsToProject,
  CreateProjectPayload,
  DeleteProjectPayload,
  GetProjectPayload,
  ListClientProjectPayload,
  ListProjectsPayload,
  UpdateProjectPayload,
} from 'libs/interfaces';

@Injectable()
export class ProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositorySign,
    @Inject(PRISMA_SERVICE)
    private readonly prismaService: PrismaServiceSign,
    private readonly cacheUseCase: CacheUseCase,
  ) {}

  public async create(payload: CreateProjectPayload) {
    return this.projectRepository.create(payload);
  }

  public async update(payload: UpdateProjectPayload) {
    const { id, ...restOfUpdatePayload } = payload;

    return this.projectRepository.update(id, {
      ...restOfUpdatePayload,
    });
  }

  public async list(payload: ListProjectsPayload) {
    const { tenantId } = payload;

    return this.projectRepository.findAll({
      tenantId,
    });
  }

  public async listClient(payload: ListClientProjectPayload) {
    const { clientId, tenantId } = payload;

    return this.projectRepository.findAll({
      clientUserIds: {
        has: clientId,
      },
      tenantId,
    });
  }

  public async delete(payload: DeleteProjectPayload) {
    return this.projectRepository.delete(payload);
  }

  public async getOrFail(payload: GetProjectPayload) {
    const project = await this.projectRepository.findFirst({
      ...payload,
    });

    if (!project) throw new ProjectNotFoundException();

    return project;
  }

  public async addClient(payload: AddClientsToProject) {
    const { clientUserId: clientId, id: projectId, tenantId } = payload;

    const project = await this.projectRepository.findFirst({
      id: projectId,
      tenantId,
    });

    project.clientUserIds.push(clientId);

    return this.projectRepository.update(projectId, {
      clientUserIds: project.clientUserIds,
    });
  }

  public async removeClient(payload: AddClientsToProject) {
    const { clientUserId: clientId, id: projectId, tenantId } = payload;

    const project = await this.projectRepository.findFirst({
      id: projectId,
      tenantId,
    });

    const newClientIds = project.clientUserIds.filter(
      (clientUserId) => clientUserId !== clientId,
    );

    return this.projectRepository.update(projectId, {
      clientUserIds: newClientIds,
    });
  }
}
