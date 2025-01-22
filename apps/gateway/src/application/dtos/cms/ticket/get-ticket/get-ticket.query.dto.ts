import { Prisma, TicketStatus } from '@prisma/client';
import { IsOptional, ValidateNested } from 'class-validator';
import {
  IntegerFilterRequestDto,
  StringFilterRequestDto,
} from '../../../shared';
import { Expose, Type } from 'class-transformer';

class Payload
  implements Pick<Prisma.TicketWhereInput, 'id' | 'projectId' | 'status'>
{
  @ValidateNested()
  @IsOptional()
  @Type(() => IntegerFilterRequestDto)
  @Expose()
  id?: IntegerFilterRequestDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => IntegerFilterRequestDto)
  @Expose()
  projectId?: number;

  @ValidateNested()
  @IsOptional()
  @Type(() => StringFilterRequestDto)
  @Expose()
  status?: StringFilterRequestDto<TicketStatus>;
}

export class GetTicketQueryDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => Payload)
  @Expose()
  query: Payload = {};
}
