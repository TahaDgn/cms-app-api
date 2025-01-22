import { Prisma, TicketStatus } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import {
  IntegerFilterRequestDto,
  StringFilterRequestDto,
} from '../../../shared';

class Payload
  implements Pick<Prisma.TicketWhereInput, 'projectId' | 'status' | 'createdBy'>
{
  @ValidateNested()
  @IsOptional()
  @Type(() => IntegerFilterRequestDto)
  @Expose()
  projectId?: IntegerFilterRequestDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => StringFilterRequestDto)
  @Expose()
  status?: StringFilterRequestDto<TicketStatus>;

  @ValidateNested()
  @IsOptional()
  @Type(() => IntegerFilterRequestDto)
  @Expose()
  createdBy?: IntegerFilterRequestDto;
}

export class GetTicketListQueryDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => Payload)
  @Expose()
  query: Payload = {};
}
