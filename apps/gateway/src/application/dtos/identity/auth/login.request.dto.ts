import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  tenantIdentifier: string;
}
