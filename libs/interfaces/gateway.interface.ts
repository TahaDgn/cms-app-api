import { Prisma } from '@prisma/client';

export interface ResponseDto<Context = null> {
  success: boolean;

  message?: string;

  data?: Context;
}

export type AuthorizedUserPayload = Prisma.UserGetPayload<{
  include: { tenant: true };
}>;
