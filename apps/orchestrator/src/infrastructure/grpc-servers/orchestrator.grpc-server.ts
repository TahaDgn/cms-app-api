import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrchestratorUseCase } from '../../application';
import {
  UserRegistrationSagaPayload,
  UserLoginSagaPayload,
  UserCreationSagaPayload,
  UserDeletionSagaPayload,
  OrchestratorService,
  AddClientsToProjectsSagaPayload,
  AddClientsToProjectsSagaResult,
  RemoveClientsFromProjectsSagaPayload,
  RemoveClientsFromProjectsSagaResult,
  CreateProjectSagaPayload,
  CreateProjectSagaResult,
  DeleteProjectSagaPayload,
  DeleteProjectSagaResult,
} from 'libs/interfaces';
import { Observable } from 'rxjs';

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
  addClientsToProjectsSaga(
    payload: AddClientsToProjectsSagaPayload,
  ): Promise<AddClientsToProjectsSagaResult> {
    return this.orchestratorUseCase.runAddClientToProjectSaga(payload);
  }

  @GrpcMethod('OrchestratorService', 'removeClientFromProjectSaga')
  removeClientsFromProjectsSaga(
    payload: RemoveClientsFromProjectsSagaPayload,
  ): Promise<RemoveClientsFromProjectsSagaResult> {
    return this.orchestratorUseCase.runRemoveClientFromProjectSaga(payload);
  }

  @GrpcMethod('OrchestratorService', 'createProjectSaga')
  createProjectSaga(
    payload: CreateProjectSagaPayload,
  ): Promise<CreateProjectSagaResult> | Observable<CreateProjectSagaResult> {
    return this.orchestratorUseCase.runCreateProjectSaga(payload);
  }

  @GrpcMethod('OrchestratorService', 'deleteProjectSaga')
  deleteProjectSaga(
    payload: DeleteProjectSagaPayload,
  ): Promise<DeleteProjectSagaResult> | Observable<DeleteProjectSagaResult> {
    return this.orchestratorUseCase.runDeleteProjectSaga(payload);
  }
}
