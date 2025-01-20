// apps/identity/src/infrastructure/grpc/identity.server.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TenantUseCase } from '../../application';
import {
  CreateTenantAndUserPayload,
  CreateTenantAndUserResponse,
  DecrementTenantProjectsCountPayload,
  DeleteTenantPayload,
  GetTenantResponse,
  IdentityService,
  IncrementTenantProjectsCountPayload,
  UpdateTenantPayload,
} from 'libs/interfaces';

@Controller()
export class TenantGrpcServer
  implements
    Pick<
      IdentityService,
      | 'createTenantWithOwner'
      | 'deleteTenant'
      | 'updateTenant'
      | 'incrementTenantProjectsCount'
      | 'decrementTenantProjectsCount'
    >
{
  constructor(private readonly tenantUseCase: TenantUseCase) {}

  @GrpcMethod('IdentityService', 'createTenantAndUser')
  createTenantWithOwner(
    payload: CreateTenantAndUserPayload,
  ): Promise<CreateTenantAndUserResponse> {
    return this.tenantUseCase.createWithOwner(payload);
  }

  @GrpcMethod('IdentityService', 'updateTenant')
  updateTenant(payload: UpdateTenantPayload): Promise<GetTenantResponse> {
    return this.tenantUseCase.update(payload);
  }

  @GrpcMethod('IdentityService', 'incrementTenantProjectsCount')
  incrementTenantProjectsCount(
    payload: IncrementTenantProjectsCountPayload,
  ): Promise<GetTenantResponse> {
    return this.tenantUseCase.incrementProjectsCount(payload);
  }

  @GrpcMethod('IdentityService', 'decrementTenantProjectsCount')
  decrementTenantProjectsCount(
    payload: DecrementTenantProjectsCountPayload,
  ): Promise<GetTenantResponse> {
    return this.tenantUseCase.decrementProjectsCount(payload);
  }

  @GrpcMethod('IdentityService', 'deleteTenant')
  deleteTenant(payload: DeleteTenantPayload): Promise<GetTenantResponse> {
    return this.tenantUseCase.delete(payload);
  }
}
