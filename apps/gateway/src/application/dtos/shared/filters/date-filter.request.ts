import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDate, IsOptional } from 'class-validator';

export class DateFilterRequest implements Prisma.DateTimeFilter {
  @ApiProperty({ type: Date, required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @Expose()
  equals?: Date;

  @ApiProperty({ type: [Date], required: false })
  @IsDate({ each: true })
  @ArrayMaxSize(16)
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  @Type(() => Date)
  @Expose()
  in?: Date[];

  @ApiProperty({ type: [Date], required: false })
  @IsDate({ each: true })
  @ArrayMaxSize(16)
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  @Type(() => Date)
  @Type(() => Date)
  @Expose()
  notIn?: Date[];

  @ApiProperty({ type: Date, required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @Expose()
  lt?: Date;

  @ApiProperty({ type: Date, required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @Expose()
  lte?: Date;

  @ApiProperty({ type: Date, required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @Expose()
  gt?: Date;

  @ApiProperty({ type: Date, required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @Expose()
  gte?: Date;

  @ApiProperty({ type: Date, required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @Expose()
  not?: Date;
}
