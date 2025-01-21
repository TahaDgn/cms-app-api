import { Project, ProjectStatus } from '@prisma/client';

class Payload implements Partial<Pick<Project, 'clientUserIds' | 'status'>> {
  clientUserIds?: number[];

  status?: ProjectStatus;
}

export class ListProjectQueryDto {
  query: Payload;
}
