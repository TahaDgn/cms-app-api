import { TicketComment } from '@prisma/client';

class GetTicketCommentListRequestPayload
  implements Partial<Pick<TicketComment, 'ticketId' | 'createdBy'>>
{
  ticketId?: number;
  createdBy?: number;
}

export class GetTicketCommentListRequestDto {
  query: GetTicketCommentListRequestPayload;
}
