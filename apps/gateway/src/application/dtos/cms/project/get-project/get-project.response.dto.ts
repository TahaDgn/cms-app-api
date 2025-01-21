import { Prisma, ProjectStatus } from '@prisma/client';
import { ListTicketsResponsePayload } from '../../ticket/list-tickets/get-ticket-list.response.dto';
import { ResponseDto } from 'libs/interfaces';

export class GetProjectResponsePayload
  implements Prisma.ProjectGetPayload<{ include: { tickets: true } }>
{
  id: number;
  tenantId: number;
  title: string;
  description: string;
  status: ProjectStatus;
  clientUserIds: number[];
  tickets: ListTicketsResponsePayload[];
  createdAt: Date;
  updatedAt: Date;
}

export class GetProjectResponseDto
  implements ResponseDto<GetProjectResponsePayload>
{
  success: boolean;
  message?: string;
  data?: GetProjectResponsePayload;
}
