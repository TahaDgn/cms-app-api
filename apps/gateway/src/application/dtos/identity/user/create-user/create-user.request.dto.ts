import { UserType } from '@prisma/client';
import { IsNotEmpty, IsString, IsEmail, IsEnum } from 'class-validator';

class Payload {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  type: UserType;
}

export class CreateUserRequestDto {
  createPayload: Payload;
}
