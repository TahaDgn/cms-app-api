import { Prisma, UserType } from '@prisma/client';
import { StringFilterRequestDto } from '../../../shared';
import { Expose, Type } from 'class-transformer';
import { ValidateNested, IsOptional } from 'class-validator';

class Payload implements Pick<Prisma.UserWhereInput, 'type'> {
  @ValidateNested()
  @IsOptional()
  @Type(() => StringFilterRequestDto)
  @Expose()
  type?: StringFilterRequestDto<UserType>;
}

export class ListUsersQueryDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => Payload)
  @Expose()
  query: Payload = {};
}
