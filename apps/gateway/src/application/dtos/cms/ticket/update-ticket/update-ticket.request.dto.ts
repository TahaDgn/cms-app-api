import { Ticket, TicketStatus } from '@prisma/client';

class Payload implements Pick<Ticket, 'description' | 'status'> {
  description: string;
  status: TicketStatus;
}

export class UpdateTicketRequestDto implements Pick<Ticket, 'id'> {
  id: number;

  updatePayload: Payload;
}
