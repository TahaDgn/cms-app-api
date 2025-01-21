import { User, UserType } from '@prisma/client';

class Payload implements Partial<Pick<User, 'type'>> {
  type: UserType;
}

export class ListUsersQueryDto {
  query: Payload;
}
