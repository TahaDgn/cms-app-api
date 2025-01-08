import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrchestratorUseCase } from '../../application';
import {
  UserRegistrationSagaPayload,
  UserLoginSagaPayload,
  UserCreationSagaPayload,
  UserDeletionSagaPayload,
  OrchestratorService,
  AddClientToProjectSagaPayload,
  AddClientToProjectSagaResult,
  RemoveClientFromProjectSagaPayload,
  RemoveClientFromProjectSagaResult,
} from 'libs/interfaces';

@Controller()
export class OrchestratorGrpcServer implements OrchestratorService {
  constructor(private readonly orchestratorUseCase: OrchestratorUseCase) {}

  @GrpcMethod('OrchestratorService', 'userRegistrationSaga')
  async userRegistrationSaga(payload: UserRegistrationSagaPayload) {
    return this.orchestratorUseCase.runUserRegistrationSaga(payload);
  }

  @GrpcMethod('OrchestratorService', 'userLoginSaga')
  async userLoginSaga(payload: UserLoginSagaPayload) {
    return this.orchestratorUseCase.runUserLoginSaga(payload);
  }

  @GrpcMethod('OrchestratorService', 'userCreationSaga')
  async userCreationSaga(payload: UserCreationSagaPayload) {
    return this.orchestratorUseCase.runUserCreationSaga(payload);
  }

  @GrpcMethod('OrchestratorService', 'userDeletionSaga')
  async userDeletionSaga(payload: UserDeletionSagaPayload) {
    return this.orchestratorUseCase.runUserDeletionSaga(payload);
  }

  @GrpcMethod('OrchestratorService', 'addClientToProjectSaga')
  addClientToProjectSaga(
    payload: AddClientToProjectSagaPayload,
  ): Promise<AddClientToProjectSagaResult> {
    return this.orchestratorUseCase.runAddClientToProjectSaga(payload);
  }

  @GrpcMethod('OrchestratorService', 'removeClientFromProjectSaga')
  removeClientFromProjectSaga(
    payload: RemoveClientFromProjectSagaPayload,
  ): Promise<RemoveClientFromProjectSagaResult> {
    return this.orchestratorUseCase.runRemoveClientFromProjectSaga(payload);
  }
}
