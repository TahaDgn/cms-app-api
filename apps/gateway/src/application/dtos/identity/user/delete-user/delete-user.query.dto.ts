import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteUserQueryDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Expose()
  id: number;
}
