import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Expose } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class StringFilterRequest<T extends string = string>
  implements Prisma.StringFilter
{
  @ApiProperty({ type: String, required: false })
  @MaxLength(255)
  @MinLength(1)
  @IsString()
  @IsOptional()
  @Expose()
  equals?: T;

  @ApiProperty({ type: [String], required: false })
  @MaxLength(255, { each: true })
  @MinLength(1, { each: true })
  @IsString({ each: true })
  @ArrayMaxSize(16)
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  @Expose()
  in?: T[];

  @ApiProperty({ type: [String], required: false })
  @MaxLength(255, { each: true })
  @MinLength(1, { each: true })
  @IsString({ each: true })
  @ArrayMaxSize(16)
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  @Expose()
  notIn?: T[];

  @ApiProperty({ type: String, required: false })
  @MaxLength(255)
  @MinLength(1)
  @IsString()
  @IsOptional()
  @Expose()
  lt?: T;

  @ApiProperty({ type: String, required: false })
  @MaxLength(255)
  @MinLength(1)
  @IsString()
  @IsOptional()
  @Expose()
  lte?: T;

  @ApiProperty({ type: String, required: false })
  @MaxLength(255)
  @MinLength(1)
  @IsString()
  @IsOptional()
  @Expose()
  gt?: T;

  @ApiProperty({ type: String, required: false })
  @MaxLength(255)
  @MinLength(1)
  @IsString()
  @IsOptional()
  @Expose()
  gte?: T;

  @ApiProperty({ type: String, required: false })
  @MaxLength(255)
  @MinLength(1)
  @IsString()
  @IsOptional()
  @Expose()
  startsWith?: T;

  @ApiProperty({ type: String, required: false })
  @MaxLength(255)
  @MinLength(1)
  @IsString()
  @IsOptional()
  @Expose()
  not?: T;
}
