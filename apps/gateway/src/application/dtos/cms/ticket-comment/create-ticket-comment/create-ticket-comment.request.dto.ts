import { TicketComment } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

class Payload implements Pick<TicketComment, 'content' | 'ticketId'> {
  @MaxLength(1000)
  @IsString()
  @IsNotEmpty()
  @Expose()
  content: string;

  @Min(1)
  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Expose()
  ticketId: number;
}

export class CreateTicketCommentRequestDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Payload)
  @Expose()
  createPayload: Payload;
}
