import { User, UserIssue, UserType } from '@prisma/client';
import { ResponseDto } from 'libs/interfaces';

class ParticipantResponseDto implements User {
  id: number;

  tenantId: number;

  name: string;

  email: string;

  type: UserType;

  issues: UserIssue[];

  createdAt: Date;

  updatedAt: Date;
}

export class CreateParticipantResponseDto
  implements ResponseDto<ParticipantResponseDto>
{
  success: boolean;

  data?: ParticipantResponseDto;
}
