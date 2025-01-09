import { User, UserIssue, UserType } from '@prisma/client';
import { ResponseDto } from 'libs/interfaces';

class UserListItemResponseDto implements User {
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
  implements ResponseDto<UserListItemResponseDto[]>
{
  success: boolean;

  data?: UserListItemResponseDto[];
}
