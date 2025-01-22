import { UserType } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsEnum,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

class Payload {
  @MaxLength(80)
  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @MaxLength(256)
  @MinLength(10)
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  @Expose()
  type: UserType;
}

export class CreateUserRequestDto {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => Payload)
  @Expose()
  createPayload: Payload;
}
