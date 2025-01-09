import { Ticket, TicketStatus } from '@prisma/client';
import { ResponseDto } from 'libs/interfaces';

export class GetTicketListResponsePayload implements Ticket {
  id: number;

  description: string;

  projectId: number;

  status: TicketStatus;

  tenantId: number;

  createdBy: number;

  createdAt: Date;

  updatedAt: Date;
}

export class GetTicketListResponseDto
  implements ResponseDto<GetTicketListResponsePayload[]>
{
  success: boolean;
  message?: string;
  data?: GetTicketListResponsePayload[];
}
