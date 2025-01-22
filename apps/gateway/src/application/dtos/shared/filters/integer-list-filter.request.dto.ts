import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class IntegerListFilterRequestDto
  implements Prisma.IntNullableListFilter
{
  @ApiProperty({ type: Number, required: false })
  @Max(Number.MAX_SAFE_INTEGER)
  @Min(Number.MIN_SAFE_INTEGER)
  @IsInt()
  @IsOptional()
  @Expose()
  has?: number;

  @ApiProperty({ type: [Number], required: false })
  @Max(Number.MAX_SAFE_INTEGER, { each: true })
  @Min(Number.MIN_SAFE_INTEGER, { each: true })
  @IsInt({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  @Expose()
  hasSome?: number[];
}
