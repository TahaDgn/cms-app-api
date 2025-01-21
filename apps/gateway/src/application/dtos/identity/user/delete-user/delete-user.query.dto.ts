import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteUserQueryDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  id: number;
}
