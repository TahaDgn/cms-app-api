import { Project } from '@prisma/client';

class Payload implements Pick<Project, 'title' | 'description'> {
  title: string;
  description: string;
}

export class ProjectCreateRequestDto {
  createPayload: Payload;
}
