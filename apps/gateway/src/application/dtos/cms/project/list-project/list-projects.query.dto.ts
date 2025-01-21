import { Project, ProjectStatus } from '@prisma/client';

class Payload implements Partial<Pick<Project, 'clientUserIds' | 'status'>> {
  status?: ProjectStatus;
}

export class ListProjectsQueryDto {
  query: Payload;
}
