import {
  Prisma,
  Tenant,
  TenantIssue,
  UserIssue,
  UserType,
} from '@prisma/client';
import { ResponseDto } from 'libs/interfaces';

class TenantJoinPayload implements Tenant {
  name: string;
  id: number;
  identifier: string;
  ownerId: number;
  issues: TenantIssue[];
  clientsCount: number;
  participantsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class GetUserResponsePayload
  implements Prisma.UserGetPayload<{ include: { tenant: true } }>
{
  tenant: TenantJoinPayload;
  name: string;
  id: number;
  issues: UserIssue[];
  createdAt: Date;
  updatedAt: Date;
  tenantId: number;
  email: string;
  type: UserType;
}

export class GetUserResponseDto implements ResponseDto<GetUserResponsePayload> {
  success: boolean;

  message?: string;

  data?: GetUserResponsePayload;
}
