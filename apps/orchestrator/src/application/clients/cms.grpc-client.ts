import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { CMS_SERVICE_GRPC_URL } from 'libs/constants';
import {
  AddOrRemoveClientFromProjectPayload,
  AddOrRemoveClientFromProjectResponse,
  CmsService as CmsGrpcServer,
  CreateProjectPayload,
  CreateProjectResponse,
  DeleteProjectPayload,
  DeleteProjectResponse,
  GetProjectPayload,
  GetProjectResponse,
  ListClientProjectPayload,
  ListClientProjectsResponse,
  UpdateProjectPayload,
  UpdateProjectResponse,
} from 'libs/interfaces';
import { join } from 'path';

@Injectable()
export class CmsGrpcClient
  implements
    OnModuleInit,
    Pick<
      CmsGrpcServer,
      | 'addClientToProject'
      | 'createProject'
      | 'deleteProject'
      | 'getProject'
      | 'updateProject'
      | 'removeClientFromProject'
      | 'listClientProjects'
    >
{
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'cms',
      protoPath: join(process.cwd(), '/protos/cms.proto'),
      url: CMS_SERVICE_GRPC_URL,
    },
  })
  private client: ClientGrpc;

  private cmsGrpcServer: CmsGrpcServer;

  onModuleInit() {
    this.cmsGrpcServer = this.client.getService<CmsGrpcServer>('CmsService');
  }

  addClientToProject(
    payload: AddOrRemoveClientFromProjectPayload,
  ): Promise<AddOrRemoveClientFromProjectResponse> {
    return this.cmsGrpcServer.addClientToProject(payload);
  }

  createProject(payload: CreateProjectPayload): Promise<CreateProjectResponse> {
    return this.cmsGrpcServer.createProject(payload);
  }

  deleteProject(payload: DeleteProjectPayload): Promise<DeleteProjectResponse> {
    return this.cmsGrpcServer.deleteProject(payload);
  }

  getProject(payload: GetProjectPayload): Promise<GetProjectResponse> {
    return this.cmsGrpcServer.getProject(payload);
  }

  updateProject(payload: UpdateProjectPayload): Promise<UpdateProjectResponse> {
    return this.cmsGrpcServer.updateProject(payload);
  }

  removeClientFromProject(
    payload: AddOrRemoveClientFromProjectPayload,
  ): Promise<AddOrRemoveClientFromProjectResponse> {
    return this.cmsGrpcServer.removeClientFromProject(payload);
  }

  listClientProjects(
    payload: ListClientProjectPayload,
  ): Promise<ListClientProjectsResponse> {
    return this.cmsGrpcServer.listClientProjects(payload);
  }
}
