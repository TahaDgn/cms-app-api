import { Prisma, UserIssue, UserType } from '@prisma/client';
import { ResponseDto } from 'libs/interfaces';
import { GetTenantPResponsePayload } from '../../tenant';

export class GetUserResponsePayload
  implements Prisma.UserGetPayload<{ include: { tenant: true } }>
{
  id: number;

  name: string;

  issues: UserIssue[];

  tenantId: number;

  email: string;

  type: UserType;

  createdAt: Date;

  updatedAt: Date;

  tenant: GetTenantPResponsePayload;
}

export class GetUserResponseDto implements ResponseDto<GetUserResponsePayload> {
  success: boolean;

  message?: string;

  data?: GetUserResponsePayload;
}
