import { Ticket, TicketStatus } from '@prisma/client';

export class GetTicketListRequestPayload
  implements Partial<Pick<Ticket, 'projectId' | 'status' | 'createdBy'>>
{
  projectId?: number;

  status?: TicketStatus;

  createdBy?: number;
}

export class GetTicketListRequestDto {
  query: GetTicketListRequestPayload;
}
