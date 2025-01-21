import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CmsService,
  AuthorizedUserPayload,
  DeleteTicketPayload,
  GetTicketResponse,
  UpdateTicketPayload,
  ListTicketsPayload,
  ListTicketsResponse,
  GetTicketPayload,
  CreateTicketPayload,
} from 'libs/interfaces';
import { Metadata } from '@grpc/grpc-js';
import { TicketUseCase } from '../../application';

@Controller()
export class TicketGrpcServer
  implements
    Pick<
      CmsService,
      | 'createTicket'
      | 'updateTicket'
      | 'getTicket'
      | 'listTickets'
      | 'deleteTicket'
    >
{
  constructor(private readonly ticketUseCase: TicketUseCase) {}

  @GrpcMethod('CmsService', 'createTicket')
  async createTicket(
    payload: CreateTicketPayload,
    metadata: Metadata,
  ): Promise<GetTicketResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.ticketUseCase.create(payload, authorizedUser);
  }

  @GrpcMethod('CmsService', 'getTicket')
  async getTicket(
    payload: GetTicketPayload,
    metadata: Metadata,
  ): Promise<GetTicketResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.ticketUseCase.getOrFail(payload, authorizedUser);
  }

  @GrpcMethod('CmsService', 'listTickets')
  async listTickets(
    payload: ListTicketsPayload,
    metadata: Metadata,
  ): Promise<ListTicketsResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.ticketUseCase.list(payload, authorizedUser);
  }

  @GrpcMethod('CmsService', 'updateTicket')
  async updateTicket(
    payload: UpdateTicketPayload,
    metadata: Metadata,
  ): Promise<GetTicketResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.ticketUseCase.update(payload, authorizedUser);
  }

  @GrpcMethod('CmsService', 'deleteTicket')
  async deleteTicket(
    payload: DeleteTicketPayload,
    metadata: Metadata,
  ): Promise<GetTicketResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.ticketUseCase.delete(payload, authorizedUser);
  }
}
