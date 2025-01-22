import { Prisma } from '@prisma/client';
import { IntegerFilterRequest } from '../../../shared';

class GetUserQueryPayload implements Pick<Prisma.UserWhereInput, 'id'> {
  id?: IntegerFilterRequest;
}

export class GetUserQueryDto {
  query: GetUserQueryPayload = {};
}
