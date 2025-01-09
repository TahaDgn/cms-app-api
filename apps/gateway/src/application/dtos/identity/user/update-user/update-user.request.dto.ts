import { User } from '@prisma/client';

class Payload implements Pick<User, 'name'> {
  name: string;
}

export class UpdateUserRequestDto implements Pick<User, 'id'> {
  id: number;
  updatePayload: Payload;
}
