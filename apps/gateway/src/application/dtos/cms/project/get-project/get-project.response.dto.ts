import { Prisma, ProjectStatus } from '@prisma/client';
import { GetTicketListResponsePayload } from '../../ticket/get-ticket-list/get-ticket-list.response.dto';
import { ResponseDto } from 'libs/interfaces';
import { ListUserItemResponsePayload } from '../../../identity';

export class GetProjectResponsePayload
  implements
    Omit<
      Prisma.ProjectGetPayload<{ include: { tickets: true } }>,
      'clientUserIds'
    >
{
  tickets: GetTicketListResponsePayload[];
  id: number;
  tenantId: number;
  title: string;
  description: string;
  status: ProjectStatus;
  clients: Partial<ListUserItemResponsePayload>[];
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
