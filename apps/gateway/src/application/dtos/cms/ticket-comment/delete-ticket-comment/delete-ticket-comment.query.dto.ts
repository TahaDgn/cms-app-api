import { Type, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteTicketCommentRequestDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Expose()
  id: number;
}
