import { User } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  MaxLength,
  MinLength,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsInt,
  Min,
  ValidateNested,
  IsOptional,
} from 'class-validator';

class Payload implements Pick<User, 'name'> {
  @MaxLength(80)
  @MinLength(10)
  @IsString()
  @IsOptional()
  @Expose()
  name: string;
}

export class UpdateUserRequestDto implements Pick<User, 'id'> {
  @Min(0)
  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  id: number;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => Payload)
  @Expose()
  updatePayload: Payload;
}
