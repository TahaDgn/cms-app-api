import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteProjectQueryDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Expose()
  id: number;
}
