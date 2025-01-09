import { TicketComment } from '@prisma/client';
import { ResponseDto } from 'libs/interfaces';

export class GetTicketCommentListResponsePayload implements TicketComment {
  id: number;

  tenantId: number;

  content: string;

  ticketId: number;

  createdBy: number;

  createdAt: Date;
}

export class GetTicketCommentListResponseDto
  implements ResponseDto<GetTicketCommentListResponsePayload[]>
{
  success: boolean;

  message?: string;

  data?: GetTicketCommentListResponsePayload[];
}
