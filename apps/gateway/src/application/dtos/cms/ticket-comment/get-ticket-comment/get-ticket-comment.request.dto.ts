import { TicketComment } from '@prisma/client';

class GetTicketCommentRequestPayload
  implements Partial<Pick<TicketComment, 'id'>>
{
  id?: number;
}

export class GetTicketCommentRequestDto {
  query: GetTicketCommentRequestPayload;
}
