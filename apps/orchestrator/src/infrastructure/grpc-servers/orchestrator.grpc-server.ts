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
  ProjectCreationSagaPayload,
  ProjectCreationSagaResult,
  ProjectDeletionSagaPayload,
  ProjectDeletionSagaResult,
  RemoveClientFromProjectSagaPayload,
  RemoveClientFromProjectSagaResult,
} from 'libs/interfaces';

@Controller()
export class OrchestratorGrpcServer implements OrchestratorService {
  constructor(private readonly orchestratorService: OrchestratorUseCase) {}

  @GrpcMethod('OrchestratorService', 'userRegistrationSaga')
  async userRegistrationSaga(payload: UserRegistrationSagaPayload) {
    return this.orchestratorService.runUserRegistrationSaga(payload);
  }

  @GrpcMethod('OrchestratorService', 'userLoginSaga')
  async userLoginSaga(payload: UserLoginSagaPayload) {
    return this.orchestratorService.runUserLoginSaga(payload);
  }

  @GrpcMethod('OrchestratorService', 'userCreationSaga')
  async userCreationSaga(payload: UserCreationSagaPayload) {
    return this.orchestratorService.runUserCreationSaga(payload);
  }

  @GrpcMethod('OrchestratorService', 'userDeletionSaga')
  async userDeletionSaga(payload: UserDeletionSagaPayload) {
    return this.orchestratorService.runUserDeletionSaga(payload);
  }

  @GrpcMethod('OrchestratorService', 'projectCreationSaga')
  projectCreationSaga(payload: ProjectCreationSagaPayload): Promise<ProjectCreationSagaResult> {
    return this.orchestratorService.
  }

  @GrpcMethod('OrchestratorService', 'projectDeletionSaga')
  projectDeletionSaga(payload: ProjectDeletionSagaPayload): Promise<ProjectDeletionSagaResult> {
    throw new Error('Method not implemented.');
  }

  @GrpcMethod('OrchestratorService', 'addClientToProjectSaga')
  addClientToProjectSaga(payload: AddClientToProjectSagaPayload): Promise<AddClientToProjectSagaResult> {
    throw new Error('Method not implemented.');
  }

  @GrpcMethod('OrchestratorService', 'removeClientFromProjectSaga')
  removeClientFromProjectSaga(payload: RemoveClientFromProjectSagaPayload): Promise<RemoveClientFromProjectSagaResult> {
    throw new Error('Method not implemented.');
  }
}
