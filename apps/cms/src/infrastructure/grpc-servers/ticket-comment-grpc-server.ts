import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CmsService,
  AuthorizedUserPayload,
  GetTicketResponse,
  CreateTicketCommentPayload,
  DeleteTicketCommentPayload,
} from 'libs/interfaces';
import { Metadata } from '@grpc/grpc-js';
import { TicketCommentUseCase } from '../../application';

@Controller()
export class TicketCommentGrpcServer
  implements Pick<CmsService, 'createTicketComment' | 'deleteTicketComment'>
{
  constructor(private readonly ticketCommentUseCase: TicketCommentUseCase) {}

  @GrpcMethod('CmsService', 'createTicketComment')
  async createTicketComment(
    payload: CreateTicketCommentPayload,
    metadata: Metadata,
  ): Promise<GetTicketResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.ticketCommentUseCase.create(payload, authorizedUser);
  }

  @GrpcMethod('CmsService', 'deleteTicketComment')
  async deleteTicketComment(
    payload: DeleteTicketCommentPayload,
    metadata: Metadata,
  ): Promise<GetTicketResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.ticketCommentUseCase.delete(payload, authorizedUser);
  }
}
