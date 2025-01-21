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
  ): Promise<UserRegistrationSagaResult> {
    return lastValueFrom(
      <Observable<UserRegistrationSagaResult>>(
        this.orchestratorGrpcService.userRegistrationSaga(payload)
      ),
    );
  }
  async userLoginSaga(
    payload: UserLoginSagaPayload,
  ): Promise<UserLoginSagaResult> {
    return lastValueFrom(
      <Observable<UserLoginSagaResult>>(
        this.orchestratorGrpcService.userLoginSaga(payload)
      ),
    );
  }

  async userCreationSaga(
    payload: UserCreationSagaPayload,
  ): Promise<UserCreationSagaResult> {
    return lastValueFrom(
      <Observable<UserCreationSagaResult>>(
        this.orchestratorGrpcService.userCreationSaga(payload)
      ),
    );
  }
  async userDeletionSaga(
    payload: UserDeletionSagaPayload,
  ): Promise<UserDeletionSagaResult> {
    return lastValueFrom(
      <Observable<UserDeletionSagaResult>>(
        this.orchestratorGrpcService.userDeletionSaga(payload)
      ),
    );
  }

  async addClientsToProjectsSaga(
    payload: AddClientsToProjectsSagaPayload,
  ): Promise<AddClientsToProjectsSagaResult> {
    return lastValueFrom(
      <Observable<AddClientsToProjectsSagaResult>>(
        this.orchestratorGrpcService.addClientsToProjectsSaga(payload)
      ),
    );
  }

  async removeClientsFromProjectsSaga(
    payload: RemoveClientsFromProjectsSagaPayload,
  ): Promise<RemoveClientsFromProjectsSagaResult> {
    return lastValueFrom(
      <Observable<RemoveClientsFromProjectsSagaResult>>(
        this.orchestratorGrpcService.removeClientsFromProjectsSaga(payload)
      ),
    );
  }

  async createProjectSaga(
    payload: CreateProjectSagaPayload,
  ): Promise<CreateProjectSagaResult> {
    return lastValueFrom(
      <Observable<CreateProjectSagaResult>>(
        this.orchestratorGrpcService.createProjectSaga(payload)
      ),
    );
  }

  async deleteProjectSaga(
    payload: DeleteProjectSagaPayload,
  ): Promise<DeleteProjectSagaResult> {
    return lastValueFrom(
      <Observable<DeleteProjectSagaResult>>(
        this.orchestratorGrpcService.deleteProjectSaga(payload)
      ),
    );
  }
}
