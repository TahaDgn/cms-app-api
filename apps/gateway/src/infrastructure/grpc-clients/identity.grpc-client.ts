import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  IdentityService,
  ListUsersResponse,
  ListUserPayload,
  VerifyAccessPayload,
  VerifyAccessResponse,
  RemoveAccessTokenPayload,
  RemoveAccessTokenResponse,
} from 'libs/interfaces';
import { IDENTITY_SERVICE_GRPC_URL } from 'libs/constants';

@Injectable()
export class IdentityGrpcClient implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'identity',
      protoPath: join(process.cwd(), '/protos/identity.proto'),
      url: IDENTITY_SERVICE_GRPC_URL,
    },
  })
  private client: ClientGrpc;

  private identityService: IdentityService;

  onModuleInit() {
    this.identityService =
      this.client.getService<IdentityService>('IdentityService');
  }

  public async listTenantUsers(
    payload: ListUserPayload,
  ): Promise<ListUsersResponse> {
    return this.identityService.listUsers(payload);
  }

  public async verifyAccessCode(
    payload: VerifyAccessPayload,
  ): Promise<VerifyAccessResponse> {
    return this.identityService.verifyAccessCode(payload);
  }

  public async removeAccessToken(
    payload: RemoveAccessTokenPayload,
  ): Promise<RemoveAccessTokenResponse> {
    return this.identityService.removeAccessToken(payload);
  }
}
