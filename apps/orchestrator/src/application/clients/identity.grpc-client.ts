import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  AccessRequestPayload,
  CreateTenantAndUserPayload,
  CreateUserPayload,
  CreateUserResponse,
  DeleteTenantPayload,
  DeleteUserPayload,
  IdentityService,
  RemoveAccessCodePayload,
} from 'libs/interfaces';

@Injectable()
export class IdentityGrpcClient implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'identity',
      protoPath: join(__dirname, 'identity.proto'),
    },
  })
  private client: ClientGrpc;

  private identityService: IdentityService;

  onModuleInit() {
    this.identityService =
      this.client.getService<IdentityService>('IdentityService');
  }

  public createUser(payload: CreateUserPayload): Promise<CreateUserResponse> {
    return this.identityService.createUser(payload);
  }

  public createTenantAndUser(payload: CreateTenantAndUserPayload) {
    return this.identityService.createTenantAndUser(payload);
  }

  public createAccessRequestLink(payload: AccessRequestPayload) {
    return this.identityService.createAccessRequestLink(payload);
  }

  public deleteUser(payload: DeleteUserPayload) {
    return this.identityService.deleteUser(payload);
  }

  public deleteTenant(payload: DeleteTenantPayload) {
    return this.identityService.deleteTenant(payload);
  }

  public removeAccessCode(payload: RemoveAccessCodePayload) {
    return this.identityService.removeAccessCode(payload);
  }
}
