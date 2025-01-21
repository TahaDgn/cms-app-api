import { Tenant, User } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class TenantPayload implements Pick<Tenant, 'name' | 'identifier'> {
  @MaxLength(80)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(80)
  @IsString()
  @IsNotEmpty()
  identifier: string;
}

class UserPayload implements Pick<User, 'email' | 'name'> {
  @MaxLength(80)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  email: string;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => TenantPayload)
  tenant: TenantPayload;
}

export class RegisterRequestDto {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => UserPayload)
  createPayload: UserPayload;
}
