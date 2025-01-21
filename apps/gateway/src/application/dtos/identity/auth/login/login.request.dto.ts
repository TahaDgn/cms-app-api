import { Tenant } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsEmail,
  ValidateNested,
  MaxLength,
  IsString,
} from 'class-validator';

class TenantPayload implements Pick<Tenant, 'identifier'> {
  @MaxLength(80)
  @IsString()
  @IsNotEmpty()
  identifier: string;
}

class UserPayload {
  @MaxLength(256)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => TenantPayload)
  tenant: TenantPayload;
}

export class LoginRequestDto {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => UserPayload)
  createPayload: UserPayload;
}
