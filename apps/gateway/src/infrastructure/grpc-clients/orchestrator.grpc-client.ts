import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  OrchestratorService,
  UserRegistrationSagaPayload,
  UserLoginSagaPayload,
  UserCreationSagaPayload,
  UserDeletionSagaPayload,
} from 'libs/interfaces';

@Injectable()
export class OrchestratorGrpcClient implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'orchestrator',
      protoPath: join(process.cwd(), '/protos/orchestrator.proto'),
    },
  })
  private client: ClientGrpc;

  private orchestratorService: OrchestratorService;

  onModuleInit() {
    this.orchestratorService = this.client.getService<OrchestratorService>(
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
}
