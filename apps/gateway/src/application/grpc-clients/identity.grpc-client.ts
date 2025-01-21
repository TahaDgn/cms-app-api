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
  DecrementTenantProjectsCountPayload,
  IncrementTenantProjectsCountPayload,
} from 'libs/interfaces';
import { IDENTITY_SERVICE_GRPC_URL } from 'libs/constants';
import { lastValueFrom, Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

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
    metadata: Metadata,
  ): Promise<GetUserResponse> {
    return lastValueFrom(
      <Observable<GetUserResponse>>(
        this.identityGrpcServer.createUser(payload, metadata)
      ),
    );
  }

  public async createTenantWithOwner(
    payload: CreateTenantAndUserPayload,
    metadata: Metadata,
  ) {
    return lastValueFrom(
      <Observable<CreateTenantAndUserResponse>>(
        this.identityGrpcServer.createTenantWithOwner(payload, metadata)
      ),
    );
  }

  public async createAccessRequestLink(
    payload: AccessRequestPayload,
    metadata: Metadata,
  ) {
    return lastValueFrom(
      <Observable<AccessRequestResponse>>(
        this.identityGrpcServer.createAccessRequestLink(payload, metadata)
      ),
    );
  }

  public async deleteUser(payload: DeleteUserPayload, metadata: Metadata) {
    return lastValueFrom(
      <Observable<GetUserResponse>>(
        this.identityGrpcServer.deleteUser(payload, metadata)
      ),
    );
  }

  public async updateTenant(
    payload: UpdateTenantPayload,
    metadata: Metadata,
  ): Promise<GetTenantResponse> {
    return lastValueFrom(
      <Observable<GetTenantResponse>>(
        this.identityGrpcServer.updateTenant(payload, metadata)
      ),
    );
  }

  public async incrementTenantProjectsCount(
    payload: IncrementTenantProjectsCountPayload,
    metadata: Metadata,
  ): Promise<GetTenantResponse> {
    return lastValueFrom(
      <Observable<GetTenantResponse>>(
        this.identityGrpcServer.incrementTenantProjectsCount(payload, metadata)
      ),
    );
  }

  public async decrementTenantProjectsCount(
    payload: DecrementTenantProjectsCountPayload,
    metadata: Metadata,
  ): Promise<GetTenantResponse> {
    return lastValueFrom(
      <Observable<GetTenantResponse>>(
        this.identityGrpcServer.decrementTenantProjectsCount(payload, metadata)
      ),
    );
  }

  public async deleteTenant(
    payload: DeleteTenantPayload,
    metadata: Metadata,
  ): Promise<GetTenantResponse> {
    return lastValueFrom(
      <Observable<GetTenantResponse>>(
        this.identityGrpcServer.deleteTenant(payload, metadata)
      ),
    );
  }

  public async removeAccessCode(
    payload: RemoveAccessCodePayload,
    metadata: Metadata,
  ) {
    return lastValueFrom(
      <Observable<RemoveAccessTokenResponse>>(
        this.identityGrpcServer.removeAccessCode(payload, metadata)
      ),
    );
  }

  public async removeAccessToken(
    payload: RemoveAccessTokenPayload,
    metadata: Metadata,
  ): Promise<RemoveAccessTokenResponse> {
    return lastValueFrom(
      <Observable<RemoveAccessTokenResponse>>(
        this.identityGrpcServer.removeAccessToken(payload, metadata)
      ),
    );
  }

  getUser(
    payload: GetUserPayload,
    metadata: Metadata,
  ): Promise<GetUserResponse> {
    return lastValueFrom(
      <Observable<GetUserResponse>>(
        this.identityGrpcServer.getUser(payload, metadata)
      ),
    );
  }

  public async getUserOrFail(
    payload: GetUserPayload,
    metadata: Metadata,
  ): Promise<GetUserResponse> {
    return lastValueFrom(
      <Observable<GetUserResponse>>(
        this.identityGrpcServer.getUserOrFail(payload, metadata)
      ),
    );
  }

  public async listUsers(
    payload: ListUserPayload,
    metadata: Metadata,
  ): Promise<ListUsersResponse> {
    return lastValueFrom(
      <Observable<ListUsersResponse>>(
        this.identityGrpcServer.listUsers(payload, metadata)
      ),
    );
  }

  public async verifyAccessCode(
    payload: VerifyAccessPayload,
    metadata: Metadata,
  ): Promise<VerifyAccessResponse> {
    return lastValueFrom(
      <Observable<VerifyAccessResponse>>(
        this.identityGrpcServer.verifyAccessCode(payload, metadata)
      ),
    );
  }
}
