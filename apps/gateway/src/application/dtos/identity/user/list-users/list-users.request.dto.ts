import { User, UserType } from '@prisma/client';

export class ListUsersRequestDto implements Pick<User, 'type'> {
  type: UserType;
}
