import { Project } from '@prisma/client';

class Payload implements Pick<Project, 'clientUserIds'> {
  clientUserIds: number[];
}

export class RemoveClientsFromProjectRequestDto implements Pick<Project, 'id'> {
  id: number;

  updatePayload: Payload;
}
