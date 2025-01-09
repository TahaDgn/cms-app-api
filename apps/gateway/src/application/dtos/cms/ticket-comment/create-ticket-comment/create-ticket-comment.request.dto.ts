import { TicketComment } from '@prisma/client';

class Payload implements Pick<TicketComment, 'content' | 'ticketId'> {
  content: string;

  ticketId: number;
}

export class CreateTicketCommentRequestDto {
  createPayload: Payload;
}
