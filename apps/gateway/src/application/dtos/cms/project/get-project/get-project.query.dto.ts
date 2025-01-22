import { Prisma } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { ValidateNested, IsOptional } from 'class-validator';
import { IntegerFilterRequestDto } from '../../../shared';

class Payload implements Pick<Prisma.ProjectWhereInput, 'id'> {
  @ValidateNested()
  @IsOptional()
  @Type(() => IntegerFilterRequestDto)
  @Expose()
  id?: IntegerFilterRequestDto;
}

export class GetProjectQueryDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => Payload)
  @Expose()
  query: Payload = {};
}
