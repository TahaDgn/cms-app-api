import { Tenant, User } from '@prisma/client';

class TenantJoinPayload implements Pick<Tenant, 'name'> {
  name: string;
}

class Payload implements Pick<User, 'email' | 'name'> {
  name: string;
  email: string;
  tenant: TenantJoinPayload;
}

export class RegisterRequestDto {
  createPayload: Payload;
}
