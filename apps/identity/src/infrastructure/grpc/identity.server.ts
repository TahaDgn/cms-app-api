// apps/identity/src/infrastructure/grpc/identity.server.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { IdentityServiceApp } from '../../application/identity.service';
import {
  CreateTenantAndUserPayload,
  AccessRequestPayload,
  VerifyAccessPayload,
  CreateUserPayload,
  DeleteUserPayload,
} from 'libs/interfaces/identity.interface';

@Controller()
export class IdentityServer {
  constructor(private readonly identitySvc: IdentityServiceApp) {}

  @GrpcMethod('IdentityService', 'createTenantAndUser')
  createTenantAndUser(payload: CreateTenantAndUserPayload) {
    return this.identitySvc.createTenantAndUser(payload);
  }

  @GrpcMethod('IdentityService', 'createAccessRequestLink')
  createAccessRequestLink(payload: AccessRequestPayload) {
    return this.identitySvc.createAccessRequestLink(payload);
  }

  @GrpcMethod('IdentityService', 'verifyAccessCode')
  verifyAccessCode(payload: VerifyAccessPayload) {
    return this.identitySvc.verifyAccessCode(payload);
  }

  @GrpcMethod('IdentityService', 'createUserUnderTenant')
  createUserUnderTenant(payload: CreateUserPayload) {
    return this.identitySvc.createUserUnderTenant(payload);
  }

  @GrpcMethod('IdentityService', 'listTenantUsers')
  listTenantUsers(tenantId: number) {
    return this.identitySvc.listTenantUsers(tenantId);
  }

  @GrpcMethod('IdentityService', 'deleteUser')
  deleteUser(payload: DeleteUserPayload) {
    return this.identitySvc.deleteUser(payload);
  }
}
