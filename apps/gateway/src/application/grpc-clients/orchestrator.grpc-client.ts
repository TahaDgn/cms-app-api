import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  OrchestratorService as OrchestratorGrpcServer,
  UserRegistrationSagaPayload,
  UserLoginSagaPayload,
  UserCreationSagaPayload,
  UserDeletionSagaPayload,
  AddClientsToProjectsSagaPayload,
  AddClientsToProjectsSagaResult,
  RemoveClientsFromProjectsSagaPayload,
  RemoveClientsFromProjectsSagaResult,
  CreateProjectSagaPayload,
  CreateProjectSagaResult,
  DeleteProjectSagaPayload,
  DeleteProjectSagaResult,
  UserCreationSagaResult,
  UserDeletionSagaResult,
  UserLoginSagaResult,
  UserRegistrationSagaResult,
} from 'libs/interfaces';
import { ORCHESTRATOR_SERVICE_GRPC_URL } from 'libs/constants';
import { lastValueFrom, Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class OrchestratorGrpcClient
  implements OnModuleInit, OrchestratorGrpcServer
{
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'orchestrator',
      protoPath: join(process.cwd(), '/protos/orchestrator.proto'),
      url: ORCHESTRATOR_SERVICE_GRPC_URL,
      loader: {
        enums: String,
        defaults: false,
        arrays: true,
      },
    },
  })
  private client: ClientGrpc;

  private orchestratorGrpcService: OrchestratorGrpcServer;

  onModuleInit() {
    this.orchestratorGrpcService =
      this.client.getService<OrchestratorGrpcServer>('OrchestratorService');
  }

  async userRegistrationSaga(
    payload: UserRegistrationSagaPayload,
    metadata: Metadata,
  ): Promise<UserRegistrationSagaResult> {
    return lastValueFrom(
      <Observable<UserRegistrationSagaResult>>(
        this.orchestratorGrpcService.userRegistrationSaga(payload, metadata)
      ),
    );
  }
  async userLoginSaga(
    payload: UserLoginSagaPayload,
    metadata: Metadata,
  ): Promise<UserLoginSagaResult> {
    return lastValueFrom(
      <Observable<UserLoginSagaResult>>(
        this.orchestratorGrpcService.userLoginSaga(payload, metadata)
      ),
    );
  }

  async userCreationSaga(
    payload: UserCreationSagaPayload,
    metadata: Metadata,
  ): Promise<UserCreationSagaResult> {
    return lastValueFrom(
      <Observable<UserCreationSagaResult>>(
        this.orchestratorGrpcService.userCreationSaga(payload, metadata)
      ),
    );
  }

  async userDeletionSaga(
    payload: UserDeletionSagaPayload,
    metadata: Metadata,
  ): Promise<UserDeletionSagaResult> {
    return lastValueFrom(
      <Observable<UserDeletionSagaResult>>(
        this.orchestratorGrpcService.userDeletionSaga(payload, metadata)
      ),
    );
  }

  async addClientsToProjectsSaga(
    payload: AddClientsToProjectsSagaPayload,
    metadata: Metadata,
  ): Promise<AddClientsToProjectsSagaResult> {
    return lastValueFrom(
      <Observable<AddClientsToProjectsSagaResult>>(
        this.orchestratorGrpcService.addClientsToProjectsSaga(payload, metadata)
      ),
    );
  }

  async removeClientsFromProjectsSaga(
    payload: RemoveClientsFromProjectsSagaPayload,
    metadata: Metadata,
  ): Promise<RemoveClientsFromProjectsSagaResult> {
    return lastValueFrom(
      <Observable<RemoveClientsFromProjectsSagaResult>>(
        this.orchestratorGrpcService.removeClientsFromProjectsSaga(
          payload,
          metadata,
        )
      ),
    );
  }

  async createProjectSaga(
    payload: CreateProjectSagaPayload,
    metadata: Metadata,
  ): Promise<CreateProjectSagaResult> {
    return lastValueFrom(
      <Observable<CreateProjectSagaResult>>(
        this.orchestratorGrpcService.createProjectSaga(payload, metadata)
      ),
    );
  }

  async deleteProjectSaga(
    payload: DeleteProjectSagaPayload,
    metadata: Metadata,
  ): Promise<DeleteProjectSagaResult> {
    return lastValueFrom(
      <Observable<DeleteProjectSagaResult>>(
        this.orchestratorGrpcService.deleteProjectSaga(payload, metadata)
      ),
    );
  }
}
