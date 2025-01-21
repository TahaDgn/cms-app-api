import { TicketComment } from '@prisma/client';

class Payload
  implements Partial<Pick<TicketComment, 'ticketId' | 'createdBy'>>
{
  ticketId?: number;
  createdBy?: number;
}

export class GetTicketCommentListQueryDto {
  query: Payload;
}
