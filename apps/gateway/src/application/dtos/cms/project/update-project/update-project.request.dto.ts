import { Project, TicketStatus } from '@prisma/client';

class Payload implements Pick<Project, 'title' | 'description' | 'status'> {
  title: string;

  description: string;

  status: TicketStatus;
}

export class UpdateProjectRequestDto implements Pick<Project, 'id'> {
  id: number;

  updatePayload: Payload;
}
