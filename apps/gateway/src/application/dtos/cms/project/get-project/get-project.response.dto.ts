import { $Enums, Prisma } from '@prisma/client';
import { GetTicketListResponsePayload } from '../../ticket/get-ticket-list/get-ticket-list.response.dto';
import { ResponseDto } from 'libs/interfaces';

export class GetProjectResponsePayload
  implements Prisma.ProjectGetPayload<{ include: { tickets: true } }>
{
  tickets: GetTicketListResponsePayload[];
  id: number;
  tenantId: number;
  title: string;
  description: string;
  status: $Enums.ProjectStatus;
  clientUserIds: number[];
  createdAt: Date;
  updatedAt: Date;
}

export class GetProjectResponseDto
  implements ResponseDto<GetProjectResponseDto>
{
  success: boolean;
  message?: string;
  data?: GetProjectResponseDto;
}
