// apps/identity/src/infrastructure/grpc/identity.server.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TenantUseCase } from '../../application';
import {
  CreateTenantAndUserPayload,
  CreateTenantAndUserResponse,
  DeleteTenantPayload,
  TenantWithUsersResponse,
  IdentityService,
} from 'libs/interfaces';

@Controller()
export class TenantGrpcServer
  implements Pick<IdentityService, 'deleteTenant' | 'createTenantWithOwner'>
{
  constructor(private readonly tenantUseCase: TenantUseCase) {}

  @GrpcMethod('IdentityService', 'createTenantAndUser')
  createTenantWithOwner(
    payload: CreateTenantAndUserPayload,
  ): Promise<CreateTenantAndUserResponse> {
    return this.tenantUseCase.createWithOwner(payload);
  }

  @GrpcMethod('IdentityService', 'deleteTenant')
  deleteTenant(payload: DeleteTenantPayload): Promise<TenantWithUsersResponse> {
    return this.tenantUseCase.delete(payload);
  }
}
