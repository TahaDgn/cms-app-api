import { User } from '@prisma/client';

export class GetUserRequestPayload implements Partial<Pick<User, 'id'>> {
  id?: number;
}

export class GetUserRequestDto {
  query: GetUserRequestPayload;
}
