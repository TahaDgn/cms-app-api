import { Prisma } from '@prisma/client';
import { IntegerFilterRequestDto } from '../../../shared';
import { Type, Expose } from 'class-transformer';
import { ValidateNested, IsOptional } from 'class-validator';

class Payload
  implements Pick<Prisma.TicketCommentWhereInput, 'ticketId' | 'createdBy'>
{
  @ValidateNested()
  @IsOptional()
  @Type(() => IntegerFilterRequestDto)
  @Expose()
  ticketId?: IntegerFilterRequestDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => IntegerFilterRequestDto)
  @Expose()
  createdBy?: IntegerFilterRequestDto;
}

export class ListTicketCommentsQueryDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => Payload)
  @Expose()
  query: Payload = {};
}
