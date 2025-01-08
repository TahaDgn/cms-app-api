import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  AccessRequestPayload,
  CreateTenantAndUserPayload,
  CreateUserPayload,
  UserWithTenantResponse,
  DeleteTenantPayload,
  DeleteUserPayload,
  IdentityService as IdentityGrpcServer,
  RemoveAccessCodePayload,
  RemoveAccessTokenPayload,
  RemoveAccessTokenResponse,
} from 'libs/interfaces';

@Injectable()
export class IdentityGrpcClient
  implements
    OnModuleInit,
    Pick<
      IdentityGrpcServer,
      | 'createAccessRequestLink'
      | 'createTenantWithOwner'
      | 'deleteTenant'
      | 'deleteUser'
      | 'removeAccessCode'
      | 'removeAccessToken'
      | 'createUser'
    >
{
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'identity',
      protoPath: join(__dirname, 'identity.proto'),
    },
  })
  private client: ClientGrpc;

  private identityGrpcServer: IdentityGrpcServer;

  onModuleInit() {
    this.identityGrpcServer =
      this.client.getService<IdentityGrpcServer>('IdentityService');
  }

  public createUser(payload: CreateUserPayload): Promise<UserWithTenantResponse> {
    return this.identityGrpcServer.createUser(payload);
  }

  public createTenantWithOwner(payload: CreateTenantAndUserPayload) {
    return this.identityGrpcServer.createTenantWithOwner(payload);
  }

  public createAccessRequestLink(payload: AccessRequestPayload) {
    return this.identityGrpcServer.createAccessRequestLink(payload);
  }

  public deleteUser(payload: DeleteUserPayload) {
    return this.identityGrpcServer.deleteUser(payload);
  }

  public deleteTenant(payload: DeleteTenantPayload) {
    return this.identityGrpcServer.deleteTenant(payload);
  }

  public removeAccessCode(payload: RemoveAccessCodePayload) {
    return this.identityGrpcServer.removeAccessCode(payload);
  }

  public removeAccessToken(
    payload: RemoveAccessTokenPayload,
  ): Promise<RemoveAccessTokenResponse> {
    return this.identityGrpcServer.removeAccessToken(payload);
  }
}
