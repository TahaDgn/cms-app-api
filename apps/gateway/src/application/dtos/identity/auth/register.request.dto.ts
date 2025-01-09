import { UserType } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class RegisterRequestDto {
  @IsString()
  @IsNotEmpty()
  tenantName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
