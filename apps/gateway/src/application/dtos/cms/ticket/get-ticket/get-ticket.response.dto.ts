import { Prisma, TicketStatus } from '@prisma/client';
import { GetTicketCommentListResponsePayload } from '../../ticket-comment';
import { ResponseDto } from 'libs/interfaces';

export class GetTicketResponsePayload
  implements Prisma.TicketGetPayload<{ include: { ticketComments: true } }>
{
  id: number;

  projectId: number;

  tenantId: number;

  createdBy: number;

  description: string;

  status: TicketStatus;

  createdAt: Date;

  updatedAt: Date;

  ticketComments: GetTicketCommentListResponsePayload[];
}

export class GetTicketResponseDto
  implements ResponseDto<GetTicketResponsePayload>
{
  success: boolean;

  message?: string;

  data?: GetTicketResponsePayload;
}
