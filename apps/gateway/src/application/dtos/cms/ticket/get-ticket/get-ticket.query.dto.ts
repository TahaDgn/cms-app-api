import { Ticket } from '@prisma/client';

class Payload implements Partial<Pick<Ticket, 'id' | 'projectId' | 'status'>> {
  id?: number;
}

export class GetTicketQueryDto {
  query: Payload;
}
