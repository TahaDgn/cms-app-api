import { Project, User } from '@prisma/client';

class UserJoinPayload implements Pick<User, 'id'> {
  id: number;
}

class Payload {
  user: UserJoinPayload;
}

export class RemoveClientToProjectRequestDto implements Pick<Project, 'id'> {
  id: number;
  updatePayload: Payload;
}
