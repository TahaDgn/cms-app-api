import { Ticket, TicketStatus } from '@prisma/client';

class GetTicketRequestPayload
  implements Partial<Pick<Ticket, 'id' | 'projectId' | 'status'>>
{
  id?: number;

  projectId?: number;

  status?: TicketStatus;
}

export class GetTicketRequestDto {
  query: GetTicketRequestPayload;
}
