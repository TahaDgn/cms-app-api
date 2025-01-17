import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { CMS_SERVICE_GRPC_URL } from 'libs/constants';
import {
  CmsService as CmsGrpcServer,
  AddClientsToProjectsPayload,
  CreateProjectPayload,
  CreateTicketCommentPayload,
  CreateTicketPayload,
  DeleteProjectPayload,
  DeleteTicketCommentPayload,
  DeleteTicketPayload,
  GetProjectPayload,
  GetProjectResponse,
  GetTicketPayload,
  GetTicketResponse,
  ListProjectsPayload,
  ListProjectsResponse,
  ListTicketPayload,
  ListTicketResponse,
  UpdateProjectPayload,
  UpdateTicketPayload,
  RemoveClientsFromProjectsPayload,
} from 'libs/interfaces';
import { join } from 'path';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class CmsGrpcClient implements OnModuleInit, CmsGrpcServer {
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

  public async createProject(
    payload: CreateProjectPayload,
  ): Promise<GetProjectResponse> {
    return lastValueFrom(
      <Observable<GetProjectResponse>>this.cmsGrpcServer.createProject(payload),
    );
  }

  public async getProject(
    payload: GetProjectPayload,
  ): Promise<GetProjectResponse> {
    return lastValueFrom(
      <Observable<GetProjectResponse>>this.cmsGrpcServer.getProject(payload),
    );
  }

  public async listProjects(
    payload: ListProjectsPayload,
  ): Promise<ListProjectsResponse> {
    return lastValueFrom(
      <Observable<ListProjectsResponse>>(
        this.cmsGrpcServer.listProjects(payload)
      ),
    );
  }

  public async updateProject(
    payload: UpdateProjectPayload,
  ): Promise<GetProjectResponse> {
    return lastValueFrom(
      <Observable<GetProjectResponse>>this.cmsGrpcServer.updateProject(payload),
    );
  }

  public async addClientsToProjects(
    payload: AddClientsToProjectsPayload,
  ): Promise<ListProjectsResponse> {
    return lastValueFrom(
      <Observable<ListProjectsResponse>>(
        this.cmsGrpcServer.addClientsToProjects(payload)
      ),
    );
  }

  public async removeClientsFromProjects(
    payload: RemoveClientsFromProjectsPayload,
  ): Promise<ListProjectsResponse> {
    return lastValueFrom(
      <Observable<ListProjectsResponse>>(
        this.cmsGrpcServer.removeClientsFromProjects(payload)
      ),
    );
  }

  public async deleteProject(
    payload: DeleteProjectPayload,
  ): Promise<GetProjectResponse> {
    return lastValueFrom(
      <Observable<GetProjectResponse>>this.cmsGrpcServer.deleteProject(payload),
    );
  }

  public async createTicket(
    payload: CreateTicketPayload,
  ): Promise<GetTicketResponse> {
    return lastValueFrom(
      <Observable<GetTicketResponse>>this.cmsGrpcServer.createTicket(payload),
    );
  }

  public async getTicket(
    payload: GetTicketPayload,
  ): Promise<GetTicketResponse> {
    return lastValueFrom(
      <Observable<GetTicketResponse>>this.cmsGrpcServer.getTicket(payload),
    );
  }

  public async listTickets(
    payload: ListTicketPayload,
  ): Promise<ListTicketResponse> {
    return lastValueFrom(
      <Observable<ListTicketResponse>>this.cmsGrpcServer.listTickets(payload),
    );
  }

  public async updateTicket(
    payload: UpdateTicketPayload,
  ): Promise<GetTicketResponse> {
    return lastValueFrom(
      <Observable<GetTicketResponse>>this.cmsGrpcServer.updateTicket(payload),
    );
  }

  public async deleteTicket(
    payload: DeleteTicketPayload,
  ): Promise<GetTicketResponse> {
    return lastValueFrom(
      <Observable<GetTicketResponse>>this.cmsGrpcServer.deleteTicket(payload),
    );
  }

  public async createTicketComment(
    payload: CreateTicketCommentPayload,
  ): Promise<GetTicketResponse> {
    return lastValueFrom(
      <Observable<GetTicketResponse>>(
        this.cmsGrpcServer.createTicketComment(payload)
      ),
    );
  }

  public async deleteTicketComment(
    payload: DeleteTicketCommentPayload,
  ): Promise<GetTicketResponse> {
    return lastValueFrom(
      <Observable<GetTicketResponse>>(
        this.cmsGrpcServer.deleteTicketComment(payload)
      ),
    );
  }
}
