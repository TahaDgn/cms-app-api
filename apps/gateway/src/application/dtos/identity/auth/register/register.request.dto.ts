import { Tenant, User } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
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
  @Expose()
  name: string;

  @MaxLength(80)
  @IsString()
  @IsNotEmpty()
  @Expose()
  identifier: string;
}

class UserPayload implements Pick<User, 'email' | 'name'> {
  @MaxLength(80)
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  @Expose()
  email: string;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => TenantPayload)
  @Expose()
  tenant: TenantPayload;
}

export class RegisterRequestDto {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => UserPayload)
  @Expose()
  createPayload: UserPayload;
}
