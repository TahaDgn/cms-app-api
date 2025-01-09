import { Project, ProjectStatus } from '@prisma/client';

export class ListProjectRequestPayload
  implements Partial<Pick<Project, 'clientUserIds' | 'status'>>
{
  clientUserIds?: number[];

  status?: ProjectStatus;
}

export class ListProjectRequestDto {
  query: ListProjectRequestPayload;
}
