import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  IdentityService as IdentityGrpcServer,
  AccessRequestPayload,
  CreateTenantAndUserPayload,
  CreateUserPayload,
  GetUserResponse,
  DeleteTenantPayload,
  DeleteUserPayload,
  RemoveAccessCodePayload,
  RemoveAccessTokenPayload,
  RemoveAccessTokenResponse,
  GetUserPayload,
  ListUserPayload,
  ListUsersResponse,
  GetTenantResponse,
  CreateTenantAndUserResponse,
  AccessRequestResponse,
  VerifyAccessPayload,
  VerifyAccessResponse,
  UpdateTenantPayload,
} from 'libs/interfaces';
import { IDENTITY_SERVICE_GRPC_URL } from 'libs/constants';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class IdentityGrpcClient implements OnModuleInit, IdentityGrpcServer {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'identity',
      protoPath: join(process.cwd(), '/protos/identity.proto'),
      url: IDENTITY_SERVICE_GRPC_URL,
    },
  })
  private client: ClientGrpc;

  private identityGrpcServer: IdentityGrpcServer;

  onModuleInit() {
    this.identityGrpcServer =
      this.client.getService<IdentityGrpcServer>('IdentityService');
  }

  public async createUser(
    payload: CreateUserPayload,
  ): Promise<GetUserResponse> {
    return lastValueFrom(
      <Observable<GetUserResponse>>this.identityGrpcServer.createUser(payload),
    );
  }

  public async createTenantWithOwner(payload: CreateTenantAndUserPayload) {
    return lastValueFrom(
      <Observable<CreateTenantAndUserResponse>>(
        this.identityGrpcServer.createTenantWithOwner(payload)
      ),
    );
  }

  public async createAccessRequestLink(payload: AccessRequestPayload) {
    return lastValueFrom(
      <Observable<AccessRequestResponse>>(
        this.identityGrpcServer.createAccessRequestLink(payload)
      ),
    );
  }

  public async deleteUser(payload: DeleteUserPayload) {
    return lastValueFrom(
      <Observable<GetUserResponse>>this.identityGrpcServer.deleteUser(payload),
    );
  }

  public async updateTenant(
    payload: UpdateTenantPayload,
  ): Promise<GetTenantResponse> {
    return lastValueFrom(
      <Observable<GetTenantResponse>>(
        this.identityGrpcServer.updateTenant(payload)
      ),
    );
  }

  public async deleteTenant(
    payload: DeleteTenantPayload,
  ): Promise<GetTenantResponse> {
    return lastValueFrom(
      <Observable<GetTenantResponse>>(
        this.identityGrpcServer.deleteTenant(payload)
      ),
    );
  }

  public async removeAccessCode(payload: RemoveAccessCodePayload) {
    return lastValueFrom(
      <Observable<RemoveAccessTokenResponse>>(
        this.identityGrpcServer.removeAccessCode(payload)
      ),
    );
  }

  public async removeAccessToken(
    payload: RemoveAccessTokenPayload,
  ): Promise<RemoveAccessTokenResponse> {
    return lastValueFrom(
      <Observable<RemoveAccessTokenResponse>>(
        this.identityGrpcServer.removeAccessToken(payload)
      ),
    );
  }

  public async getUser(payload: GetUserPayload): Promise<GetUserResponse> {
    return lastValueFrom(
      <Observable<GetUserResponse>>this.identityGrpcServer.getUser(payload),
    );
  }

  public async listUsers(payload: ListUserPayload): Promise<ListUsersResponse> {
    return lastValueFrom(
      <Observable<ListUsersResponse>>this.identityGrpcServer.listUsers(payload),
    );
  }

  public async verifyAccessCode(
    payload: VerifyAccessPayload,
  ): Promise<VerifyAccessResponse> {
    return lastValueFrom(
      <Observable<VerifyAccessResponse>>(
        this.identityGrpcServer.verifyAccessCode(payload)
      ),
    );
  }
}
