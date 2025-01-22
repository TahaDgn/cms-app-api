import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProjectUseCase } from '../../application';
import {
  CmsService,
  AddClientsToProjectsPayload,
  CreateProjectPayload,
  DeleteProjectPayload,
  GetProjectPayload,
  GetProjectResponse,
  ListProjectsPayload,
  ListProjectsResponse,
  UpdateProjectPayload,
  AuthorizedUserPayload,
} from 'libs/interfaces';
import { Metadata } from '@grpc/grpc-js';

@Controller()
export class ProjectGrpcServer
  implements
    Pick<
      CmsService,
      | 'createProject'
      | 'getProject'
      | 'listProjects'
      | 'updateProject'
      | 'removeClientsFromProjects'
      | 'addClientsToProjects'
      | 'deleteProject'
    >
{
  constructor(private readonly projectUseCase: ProjectUseCase) {}

  @GrpcMethod('CmsService', 'createProject')
  async createProject(
    payload: CreateProjectPayload,
    metadata: Metadata,
  ): Promise<GetProjectResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.projectUseCase.create(payload, authorizedUser);
  }

  @GrpcMethod('CmsService', 'getProject')
  async getProject(
    payload: GetProjectPayload,
    metadata: Metadata,
  ): Promise<GetProjectResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.projectUseCase.getOrFail(payload, authorizedUser);
  }

  @GrpcMethod('CmsService', 'listProjects')
  async listProjects(
    payload: ListProjectsPayload,
    metadata: Metadata,
  ): Promise<ListProjectsResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.projectUseCase.list(payload, authorizedUser);
  }

  @GrpcMethod('CmsService', 'updateProject')
  async updateProject(
    payload: UpdateProjectPayload,
    metadata: Metadata,
  ): Promise<GetProjectResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.projectUseCase.update(payload, authorizedUser);
  }

  @GrpcMethod('CmsService', 'removeClientsFromProjects')
  async removeClientsFromProjects(
    payload: AddClientsToProjectsPayload,
    metadata: Metadata,
  ): Promise<ListProjectsResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.projectUseCase.removeClientsFromProjects(
      payload,
      authorizedUser,
    );
  }

  @GrpcMethod('CmsService', 'addClientsToProjects')
  async addClientsToProjects(
    payload: AddClientsToProjectsPayload,
    metadata: Metadata,
  ): Promise<ListProjectsResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.projectUseCase.addClientsToProjects(payload, authorizedUser);
  }

  @GrpcMethod('CmsService', 'deleteProject')
  async deleteProject(
    payload: DeleteProjectPayload,
    metadata: Metadata,
  ): Promise<GetProjectResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.projectUseCase.delete(payload, authorizedUser);
  }
}
