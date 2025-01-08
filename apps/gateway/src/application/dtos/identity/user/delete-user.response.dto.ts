import { User, UserIssue, UserType } from '@prisma/client';
import { ResponseDto } from 'libs/interfaces';

class DeletedUserResponseDto implements User {
  id: number;

  tenantId: number;

  name: string;

  email: string;

  type: UserType;

  issues: UserIssue[];

  createdAt: Date;

  updatedAt: Date;
}

export class DeleteUserResponseDto
  implements ResponseDto<DeletedUserResponseDto>
{
  success: boolean;

  data?: DeletedUserResponseDto;
}
