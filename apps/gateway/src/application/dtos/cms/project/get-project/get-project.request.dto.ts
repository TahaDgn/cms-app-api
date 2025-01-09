import { Project } from '@prisma/client';

export class GetProjectRequestPayload implements Partial<Pick<Project, 'id'>> {
  id?: number;
}

export class GetProjectRequestDto {
  query: GetProjectRequestPayload;
}
