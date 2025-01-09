import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  CmsService as CmsGrpcServer,
  CreateProjectPayload,
  CreateProjectResponse,
  CreateTicketPayload,
  CreateTicketResponse,
  DeleteProjectPayload,
  DeleteProjectResponse,
  DeleteTicketPayload,
  DeleteTicketResponse,
  GetProjectPayload,
  GetProjectResponse,
  ListClientProjectPayload,
  ListClientProjectsResponse,
  ListProjectsPayload,
  ListProjectsResponse,
  UpdateProjectPayload,
  UpdateProjectResponse,
  UpdateTicketPayload,
  UpdateTicketResponse,
} from 'libs/interfaces';

@Injectable()
export class CmsGrpcClient
  implements
    OnModuleInit,
    Pick<
      CmsGrpcServer,
      | 'getProject'
      | 'listClientProjects'
      | 'listProjects'
      | 'createTicket'
      | 'deleteTicket'
      | 'updateTicket'
      | 'createProject'
      | 'updateProject'
      | 'deleteProject'
    >
{
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'cms',
      protoPath: join(process.cwd(), '/protos/cms.proto'),
    },
  })
  private client: ClientGrpc;

  private cmsGrpcServer: CmsGrpcServer;

  onModuleInit() {
    this.cmsGrpcServer = this.client.getService<CmsGrpcServer>('CmsService');
  }

  public async createTicket(
    payload: CreateTicketPayload,
  ): Promise<CreateTicketResponse> {
    return this.cmsGrpcServer.createTicket(payload);
  }

  public async deleteTicket(
    payload: DeleteTicketPayload,
  ): Promise<DeleteTicketResponse> {
    return this.cmsGrpcServer.deleteTicket(payload);
  }

  public async updateTicket(
    payload: UpdateTicketPayload,
  ): Promise<UpdateTicketResponse> {
    return this.cmsGrpcServer.updateTicket(payload);
  }

  public async createProject(
    payload: CreateProjectPayload,
  ): Promise<CreateProjectResponse> {
    return this.cmsGrpcServer.createProject(payload);
  }

  public async updateProject(
    payload: UpdateProjectPayload,
  ): Promise<UpdateProjectResponse> {
    return this.cmsGrpcServer.updateProject(payload);
  }

  public async deleteProject(
    payload: DeleteProjectPayload,
  ): Promise<DeleteProjectResponse> {
    return this.cmsGrpcServer.deleteProject(payload);
  }

  public async getProject(
    payload: GetProjectPayload,
  ): Promise<GetProjectResponse> {
    return this.cmsGrpcServer.getProject(payload);
  }

  public async listClientProjects(
    payload: ListClientProjectPayload,
  ): Promise<ListClientProjectsResponse> {
    return this.cmsGrpcServer.listClientProjects(payload);
  }

  public async listProjects(
    payload: ListProjectsPayload,
  ): Promise<ListProjectsResponse> {
    return this.cmsGrpcServer.listProjects(payload);
  }
}
