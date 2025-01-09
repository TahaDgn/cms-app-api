import { Tenant } from '@prisma/client';
import { IsNotEmpty, IsEmail } from 'class-validator';

class TenantJoinTable implements Pick<Tenant, 'identifier'> {
  identifier: string;
}

class Payload {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  tenant: TenantJoinTable;
}

export class LoginRequestDto {
  createPayload: Payload;
}
