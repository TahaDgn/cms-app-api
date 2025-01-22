import { Expose, Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PagingRequestDto {
  @Min(1)
  @IsInt()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Expose()
  page = 1;

  @Max(100)
  @Min(10)
  @IsInt()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Expose()
  limit = 10;
}
