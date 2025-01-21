import { $Enums, Project } from '@prisma/client';
import { ResponseDto } from 'libs/interfaces';
import { PagingResponseDto } from '../../../shared';

export class ListProjectsResponsePayload implements Project {
  id: number;
  tenantId: number;
  title: string;
  description: string;
  status: $Enums.ProjectStatus;
  clientUserIds: number[];
  createdAt: Date;
  updatedAt: Date;
}

export class ListProjectsResponseDto
  extends PagingResponseDto
  implements ResponseDto<ListProjectsResponsePayload[]>
{
  success: boolean;

  message?: string;

  data?: ListProjectsResponsePayload[];
}
