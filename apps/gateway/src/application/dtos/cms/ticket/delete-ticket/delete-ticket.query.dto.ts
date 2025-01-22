import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteTicketQueryDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Expose()
  id: number;
}
