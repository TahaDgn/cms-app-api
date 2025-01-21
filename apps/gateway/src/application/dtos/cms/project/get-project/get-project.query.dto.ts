import { Project } from '@prisma/client';

class Payload implements Partial<Pick<Project, 'id'>> {
  id?: number;
}

export class GetProjectQueryDto {
  query: Payload;
}
