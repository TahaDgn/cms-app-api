import { TicketComment } from '@prisma/client';
import { ResponseDto } from 'libs/interfaces';

export class GetTicketCommentResponsePayload implements TicketComment {
  id: number;

  tenantId: number;

  content: string;

  ticketId: number;

  createdBy: number;

  createdAt: Date;
}

export class GetTicketCommentResponseDto
  implements ResponseDto<GetTicketCommentResponsePayload>
{
  success: boolean;

  message?: string;

  data?: GetTicketCommentResponsePayload;
}
