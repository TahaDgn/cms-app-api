import { TicketComment } from '@prisma/client';

class Payload implements Partial<Pick<TicketComment, 'id'>> {
  id?: number;
}

export class GetTicketCommentQueryDto {
  query: Payload;
}
