import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CmsService,
  CreateTicketPayload,
  CreateTicketResponse,
  DeleteTicketPayload,
  DeleteTicketResponse,
  UpdateTicketPayload,
  UpdateTicketResponse,
} from 'libs/interfaces';
import { TicketUseCase } from '../../application';

@Controller()
export class TicketGrpcServer
  implements Pick<CmsService, 'updateTicket' | 'createTicket' | 'deleteTicket'>
{
  constructor(private readonly ticketUseCase: TicketUseCase) {}

  @GrpcMethod('CmsService', 'createAccessRequestLink')
  updateTicket(payload: UpdateTicketPayload): Promise<UpdateTicketResponse> {
    return this.ticketUseCase.update(payload);
  }

  @GrpcMethod('CmsService', 'createTicket')
  createTicket(payload: CreateTicketPayload): Promise<CreateTicketResponse> {
    return this.ticketUseCase.create(payload);
  }

  @GrpcMethod('CmsService', 'deleteTicket')
  deleteTicket(payload: DeleteTicketPayload): Promise<DeleteTicketResponse> {
    return this.ticketUseCase.delete(payload);
  }
}
