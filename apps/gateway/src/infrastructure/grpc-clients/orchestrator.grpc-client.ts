import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  OrchestratorService as OrchestratorGrpcServer,
  UserRegistrationSagaPayload,
  UserLoginSagaPayload,
  UserCreationSagaPayload,
  UserDeletionSagaPayload,
  AddClientToProjectSagaPayload,
  AddClientToProjectSagaResult,
  RemoveClientFromProjectSagaPayload,
  RemoveClientFromProjectSagaResult,
} from 'libs/interfaces';

@Injectable()
export class OrchestratorGrpcClient
  implements OnModuleInit, OrchestratorGrpcServer
{
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'orchestrator',
      protoPath: join(process.cwd(), '/protos/orchestrator.proto'),
    },
  })
  private client: ClientGrpc;

  private orchestratorService: OrchestratorGrpcServer;

  onModuleInit() {
    this.orchestratorService = this.client.getService<OrchestratorGrpcServer>(
      'OrchestratorService',
    );
  }

  async userRegistrationSaga(payload: UserRegistrationSagaPayload) {
    return this.orchestratorService.userRegistrationSaga(payload);
  }

  async userLoginSaga(payload: UserLoginSagaPayload) {
    return this.orchestratorService.userLoginSaga(payload);
  }

  async userCreationSaga(payload: UserCreationSagaPayload) {
    return this.orchestratorService.userCreationSaga(payload);
  }

  async userDeletionSaga(payload: UserDeletionSagaPayload) {
    return this.orchestratorService.userDeletionSaga(payload);
  }

  addClientToProjectSaga(
    payload: AddClientToProjectSagaPayload,
  ): Promise<AddClientToProjectSagaResult> {
    return this.orchestratorService.addClientToProjectSaga(payload);
  }
  removeClientFromProjectSaga(
    payload: RemoveClientFromProjectSagaPayload,
  ): Promise<RemoveClientFromProjectSagaResult> {
    return this.orchestratorService.removeClientFromProjectSaga(payload);
  }
}
