import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class BooleanFilterRequestDto {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @Expose()
  equals?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @Expose()
  not?: boolean;
}
