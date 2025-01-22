import { Tenant } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
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
  @Expose()
  identifier: string;
}

class UserPayload {
  @MaxLength(256)
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => TenantPayload)
  @Expose()
  tenant: TenantPayload;
}

export class LoginRequestDto {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => UserPayload)
  @Expose()
  createPayload: UserPayload;
}
