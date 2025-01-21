import { User, UserIssue, UserType } from '@prisma/client';
import { ResponseDto } from 'libs/interfaces';
import { PagingResponseDto } from '../../../shared';

export class ListUserItemResponsePayload implements User {
  id: number;

  tenantId: number;

  email: string;

  name: string;

  type: UserType;

  issues: UserIssue[];

  createdAt: Date;

  updatedAt: Date;
}

export class ListUsersResponseDto
  extends PagingResponseDto
  implements ResponseDto<ListUserItemResponsePayload[]>
{
  success: boolean;

  data?: ListUserItemResponsePayload[];
}
