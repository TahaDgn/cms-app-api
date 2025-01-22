import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class IntegerFilterRequest implements Prisma.IntFilter {
  @ApiProperty({ type: Number, required: false })
  @Max(Number.MAX_SAFE_INTEGER)
  @Min(Number.MIN_SAFE_INTEGER)
  @IsInt()
  @IsOptional()
  @Expose()
  equals?: number;

  @ApiProperty({ type: [Number], required: false })
  @Max(Number.MAX_SAFE_INTEGER, { each: true })
  @Min(Number.MIN_SAFE_INTEGER, { each: true })
  @IsInt({ each: true })
  @ArrayMaxSize(16)
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  @Expose()
  in?: number[];

  @ApiProperty({ type: [Number], required: false })
  @Max(Number.MAX_SAFE_INTEGER, { each: true })
  @Min(Number.MIN_SAFE_INTEGER, { each: true })
  @IsInt({ each: true })
  @ArrayMaxSize(16)
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  @Expose()
  notIn?: number[];

  @ApiProperty({ type: Number, required: false })
  @Max(Number.MAX_SAFE_INTEGER)
  @Min(Number.MIN_SAFE_INTEGER)
  @IsInt()
  @IsOptional()
  @Expose()
  lt?: number;

  @ApiProperty({ type: Number, required: false })
  @Max(Number.MAX_SAFE_INTEGER)
  @Min(Number.MIN_SAFE_INTEGER)
  @IsInt()
  @IsOptional()
  @Expose()
  lte?: number;

  @ApiProperty({ type: Number, required: false })
  @Max(Number.MAX_SAFE_INTEGER)
  @Min(Number.MIN_SAFE_INTEGER)
  @IsInt()
  @IsOptional()
  @Expose()
  gt?: number;

  @ApiProperty({ type: Number, required: false })
  @Max(Number.MAX_SAFE_INTEGER)
  @Min(Number.MIN_SAFE_INTEGER)
  @IsInt()
  @IsOptional()
  @Expose()
  gte?: number;
}
