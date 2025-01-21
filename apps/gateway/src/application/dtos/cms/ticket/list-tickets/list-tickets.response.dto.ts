import { Ticket, TicketStatus } from '@prisma/client';
import { ResponseDto } from 'libs/interfaces';
import { PagingResponseDto } from '../../../shared';

export class ListTicketsResponsePayload implements Ticket {
  id: number;

  description: string;

  projectId: number;

  status: TicketStatus;

  tenantId: number;

  createdBy: number;

  createdAt: Date;

  updatedAt: Date;
}

export class ListTicketsResponseDto
  extends PagingResponseDto
  implements ResponseDto<ListTicketsResponsePayload[]>
{
  success: boolean;
  message?: string;
  data?: ListTicketsResponsePayload[];
}
