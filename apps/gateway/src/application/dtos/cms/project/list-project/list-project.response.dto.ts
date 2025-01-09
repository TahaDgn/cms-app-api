import { $Enums, Project } from '@prisma/client';
import { ResponseDto } from 'libs/interfaces';

export class ListProjectResponsePayload implements Project {
  id: number;
  tenantId: number;
  title: string;
  description: string;
  status: $Enums.ProjectStatus;
  clientUserIds: number[];
  createdAt: Date;
  updatedAt: Date;
}

export class ListProjectResponseDto
  implements ResponseDto<ListProjectResponsePayload[]>
{
  success: boolean;

  message?: string;

  data?: ListProjectResponsePayload[];
}
