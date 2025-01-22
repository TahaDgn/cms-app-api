// apps/identity/src/infrastructure/grpc/identity.server.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TenantUseCase } from '../../application';
import {
  AuthorizedUserPayload,
  CreateTenantAndUserPayload,
  CreateTenantAndUserResponse,
  DecrementTenantProjectsCountPayload,
  DeleteTenantPayload,
  GetTenantResponse,
  IdentityService,
  IncrementTenantProjectsCountPayload,
  UpdateTenantPayload,
} from 'libs/interfaces';
import { Metadata } from '@grpc/grpc-js';

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

  @GrpcMethod('IdentityService', 'createTenantWithOwner')
  createTenantWithOwner(
    payload: CreateTenantAndUserPayload,
  ): Promise<CreateTenantAndUserResponse> {
    return this.tenantUseCase.createWithOwner(payload);
  }

  @GrpcMethod('IdentityService', 'updateTenant')
  updateTenant(
    payload: UpdateTenantPayload,
    metadata: Metadata,
  ): Promise<GetTenantResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.tenantUseCase.update(payload, authorizedUser);
  }

  @GrpcMethod('IdentityService', 'incrementTenantProjectsCount')
  incrementTenantProjectsCount(
    payload: IncrementTenantProjectsCountPayload,
    metadata: Metadata,
  ): Promise<GetTenantResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.tenantUseCase.incrementProjectsCount(payload, authorizedUser);
  }

  @GrpcMethod('IdentityService', 'decrementTenantProjectsCount')
  decrementTenantProjectsCount(
    payload: DecrementTenantProjectsCountPayload,
    metadata: Metadata,
  ): Promise<GetTenantResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.tenantUseCase.decrementProjectsCount(payload, authorizedUser);
  }

  @GrpcMethod('IdentityService', 'deleteTenant')
  deleteTenant(
    payload: DeleteTenantPayload,
    metadata: Metadata,
  ): Promise<GetTenantResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.tenantUseCase.delete(payload, authorizedUser);
  }
}
