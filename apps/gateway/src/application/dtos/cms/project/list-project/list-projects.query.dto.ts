import { Prisma, ProjectStatus } from '@prisma/client';
import {
  IntegerListFilterRequestDto,
  StringFilterRequestDto,
} from '../../../shared';
import { Expose, Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

class Payload
  implements Pick<Prisma.ProjectWhereInput, 'clientUserIds' | 'status'>
{
  @ValidateNested()
  @IsOptional()
  @Type(() => StringFilterRequestDto)
  @Expose()
  status?: StringFilterRequestDto<ProjectStatus>;

  @ValidateNested()
  @IsOptional()
  @Type(() => IntegerListFilterRequestDto)
  @Expose()
  clientUserIds?: IntegerListFilterRequestDto;
}

export class ListProjectsQueryDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => Payload)
  @Expose()
  query: Payload = {};
}
