import { Prisma } from '@prisma/client';
import { IntegerFilterRequestDto } from '../../../shared';
import { Expose, Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

class Payload implements Pick<Prisma.UserWhereInput, 'id'> {
  @ValidateNested()
  @IsOptional()
  @Type(() => IntegerFilterRequestDto)
  @Expose()
  id?: IntegerFilterRequestDto;
}

export class GetUserQueryDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => Payload)
  @Expose()
  query: Payload = {};
}
