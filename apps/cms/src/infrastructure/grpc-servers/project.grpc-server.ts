// apps/identity/src/infrastructure/grpc/identity.server.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProjectUseCase } from '../../application';
import {
  CmsService,
  AddOrRemoveClientFromProjectPayload,
  AddOrRemoveClientFromProjectResponse,
  CreateProjectPayload,
  CreateProjectResponse,
  DeleteProjectPayload,
  DeleteProjectResponse,
  GetProjectPayload,
  GetProjectResponse,
  ListClientProjectPayload,
  ListClientProjectsResponse,
  ListProjectsPayload,
  ListProjectsResponse,
  UpdateProjectPayload,
  UpdateProjectResponse,
} from 'libs/interfaces';

@Controller()
export class ProjectGrpcServer
  implements
    Pick<
      CmsService,
      | 'createProject'
      | 'getProject'
      | 'listProjects'
      | 'deleteProject'
      | 'updateProject'
      | 'removeClientFromProject'
      | 'addClientToProject'
      | 'listClientProjects'
    >
{
  constructor(private readonly projectUseCase: ProjectUseCase) {}

  @GrpcMethod('CmsService', 'createProject')
  createProject(payload: CreateProjectPayload): Promise<CreateProjectResponse> {
    return this.projectUseCase.create(payload);
  }

  @GrpcMethod('CmsService', 'getProject')
  getProject(payload: GetProjectPayload): Promise<GetProjectResponse> {
    return this.projectUseCase.getOrFail(payload);
  }

  @GrpcMethod('CmsService', 'listProjects')
  listProjects(payload: ListProjectsPayload): Promise<ListProjectsResponse> {
    return this.projectUseCase.list(payload);
  }

  @GrpcMethod('CmsService', 'deleteProject')
  deleteProject(payload: DeleteProjectPayload): Promise<DeleteProjectResponse> {
    return this.projectUseCase.delete(payload);
  }

  @GrpcMethod('CmsService', 'updateProject')
  updateProject(payload: UpdateProjectPayload): Promise<UpdateProjectResponse> {
    return this.projectUseCase.update(payload);
  }

  @GrpcMethod('CmsService', 'removeClientFromProject')
  removeClientFromProject(
    payload: AddOrRemoveClientFromProjectPayload,
  ): Promise<AddOrRemoveClientFromProjectResponse> {
    return this.projectUseCase.removeClient(payload);
  }

  @GrpcMethod('CmsService', 'addClientToProject')
  addClientToProject(
    payload: AddOrRemoveClientFromProjectPayload,
  ): Promise<AddOrRemoveClientFromProjectResponse> {
    return this.projectUseCase.addClient(payload);
  }

  @GrpcMethod('CmsService', 'listClientProjects')
  listClientProjects(
    payload: ListClientProjectPayload,
  ): Promise<ListClientProjectsResponse> {
    return this.projectUseCase.list(payload);
  }
}
