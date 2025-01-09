import { Project, User } from '@prisma/client';

class UserJoinPayload implements Pick<User, 'id'> {
  id: number;
}

class Payload {
  user: UserJoinPayload;
}

export class AddClientToProjectRequestDto implements Pick<Project, 'id'> {
  id: number;
  updatePayload: Payload;
}
