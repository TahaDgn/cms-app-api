import { Prisma, UserType } from '@prisma/client';
import { StringFilterRequest } from '../../../shared';

class Payload implements Pick<Prisma.UserWhereInput, 'type'> {
  type?: StringFilterRequest<UserType>;
}

export class ListUsersQueryDto {
  query: Payload = {};
}
