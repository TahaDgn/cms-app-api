import { Ticket, TicketStatus } from '@prisma/client';

class Payload
  implements Partial<Pick<Ticket, 'projectId' | 'status' | 'createdBy'>>
{
  projectId?: number;

  status?: TicketStatus;

  createdBy?: number;
}

export class GetTicketQueryRequestDto {
  query: Payload;
}
