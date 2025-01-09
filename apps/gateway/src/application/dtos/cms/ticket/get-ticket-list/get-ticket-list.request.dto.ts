import { Ticket, TicketStatus } from '@prisma/client';

export class GetTicketListRequestPayload
  implements Partial<Pick<Ticket, 'projectId' | 'status'>>
{
  projectId?: number;

  status?: TicketStatus;
}

export class GetTicketListRequestDto {
  query: GetTicketListRequestPayload;
}
