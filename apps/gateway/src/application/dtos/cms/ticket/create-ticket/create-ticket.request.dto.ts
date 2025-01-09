import { Ticket } from '@prisma/client';

class Payload implements Pick<Ticket, 'projectId' | 'description'> {
  projectId: number;
  description: string;
}

export class CreateTicketRequestDto {
  createPayload: Payload;
}
