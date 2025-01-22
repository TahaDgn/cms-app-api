import { Prisma } from '@prisma/client';
import { IntegerFilterRequestDto } from '../../../shared';
import { Type, Expose } from 'class-transformer';
import { ValidateNested, IsOptional } from 'class-validator';

class Payload implements Pick<Prisma.TicketCommentWhereInput, 'id'> {
  @ValidateNested()
  @IsOptional()
  @Type(() => IntegerFilterRequestDto)
  @Expose()
  id?: IntegerFilterRequestDto;
}

export class GetTicketCommentQueryDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => Payload)
  @Expose()
  query: Payload = {};
}
