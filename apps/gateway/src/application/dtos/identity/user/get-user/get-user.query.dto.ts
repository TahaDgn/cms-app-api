import { User } from '@prisma/client';

class GetUserQueryPayload implements Partial<Pick<User, 'id'>> {
  id?: number;
}

export class GetUserQueryDto {
  query: GetUserQueryPayload;
}
