import { Metadata } from '@grpc/grpc-js';
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
  ListTicketsPayload,
  ListTicketsResponse,
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
      loader: {
        enums: String,
        defaults: false,
        arrays: true,
      },
    },
  })
  private client: ClientGrpc;

  private cmsGrpcServer: CmsGrpcServer;

  onModuleInit() {
    this.cmsGrpcServer = this.client.getService<CmsGrpcServer>('CmsService');
  }

  public async createProject(
    payload: CreateProjectPayload,
    metadata: Metadata,
  ): Promise<GetProjectResponse> {
    return lastValueFrom(
      <Observable<GetProjectResponse>>(
        this.cmsGrpcServer.createProject(payload, metadata)
      ),
    );
  }

  public async getProject(
    payload: GetProjectPayload,
    metadata: Metadata,
  ): Promise<GetProjectResponse> {
    return lastValueFrom(
      <Observable<GetProjectResponse>>(
        this.cmsGrpcServer.getProject(payload, metadata)
      ),
    );
  }

  public async listProjects(
    payload: ListProjectsPayload,
    metadata: Metadata,
  ): Promise<ListProjectsResponse> {
    return lastValueFrom(
      <Observable<ListProjectsResponse>>(
        this.cmsGrpcServer.listProjects(payload, metadata)
      ),
    );
  }

  public async updateProject(
    payload: UpdateProjectPayload,
    metadata: Metadata,
  ): Promise<GetProjectResponse> {
    return lastValueFrom(
      <Observable<GetProjectResponse>>(
        this.cmsGrpcServer.updateProject(payload, metadata)
      ),
    );
  }

  public async addClientsToProjects(
    payload: AddClientsToProjectsPayload,
    metadata: Metadata,
  ): Promise<ListProjectsResponse> {
    return lastValueFrom(
      <Observable<ListProjectsResponse>>(
        this.cmsGrpcServer.addClientsToProjects(payload, metadata)
      ),
    );
  }

  public async removeClientsFromProjects(
    payload: RemoveClientsFromProjectsPayload,
    metadata: Metadata,
  ): Promise<ListProjectsResponse> {
    return lastValueFrom(
      <Observable<ListProjectsResponse>>(
        this.cmsGrpcServer.removeClientsFromProjects(payload, metadata)
      ),
    );
  }

  public async deleteProject(
    payload: DeleteProjectPayload,
    metadata: Metadata,
  ): Promise<GetProjectResponse> {
    return lastValueFrom(
      <Observable<GetProjectResponse>>(
        this.cmsGrpcServer.deleteProject(payload, metadata)
      ),
    );
  }

  public async createTicket(
    payload: CreateTicketPayload,
    metadata: Metadata,
  ): Promise<GetTicketResponse> {
    return lastValueFrom(
      <Observable<GetTicketResponse>>(
        this.cmsGrpcServer.createTicket(payload, metadata)
      ),
    );
  }

  public async getTicket(
    payload: GetTicketPayload,
    metadata: Metadata,
  ): Promise<GetTicketResponse> {
    return lastValueFrom(
      <Observable<GetTicketResponse>>(
        this.cmsGrpcServer.getTicket(payload, metadata)
      ),
    );
  }

  public async listTickets(
    payload: ListTicketsPayload,
    metadata: Metadata,
  ): Promise<ListTicketsResponse> {
    return lastValueFrom(
      <Observable<ListTicketsResponse>>(
        this.cmsGrpcServer.listTickets(payload, metadata)
      ),
    );
  }

  public async updateTicket(
    payload: UpdateTicketPayload,
    metadata: Metadata,
  ): Promise<GetTicketResponse> {
    return lastValueFrom(
      <Observable<GetTicketResponse>>(
        this.cmsGrpcServer.updateTicket(payload, metadata)
      ),
    );
  }

  public async deleteTicket(
    payload: DeleteTicketPayload,
    metadata: Metadata,
  ): Promise<GetTicketResponse> {
    return lastValueFrom(
      <Observable<GetTicketResponse>>(
        this.cmsGrpcServer.deleteTicket(payload, metadata)
      ),
    );
  }

  public async createTicketComment(
    payload: CreateTicketCommentPayload,
    metadata: Metadata,
  ): Promise<GetTicketResponse> {
    return lastValueFrom(
      <Observable<GetTicketResponse>>(
        this.cmsGrpcServer.createTicketComment(payload, metadata)
      ),
    );
  }

  public async deleteTicketComment(
    payload: DeleteTicketCommentPayload,
    metadata: Metadata,
  ): Promise<GetTicketResponse> {
    return lastValueFrom(
      <Observable<GetTicketResponse>>(
        this.cmsGrpcServer.deleteTicketComment(payload, metadata)
      ),
    );
  }
}
