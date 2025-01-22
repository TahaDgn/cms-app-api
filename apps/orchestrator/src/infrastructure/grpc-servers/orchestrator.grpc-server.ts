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
import { Metadata } from '@grpc/grpc-js';

@Controller()
export class OrchestratorGrpcServer implements OrchestratorService {
  constructor(private readonly orchestratorUseCase: OrchestratorUseCase) {}

  @GrpcMethod('OrchestratorService', 'userRegistrationSaga')
  async userRegistrationSaga(
    payload: UserRegistrationSagaPayload,
    metadata: Metadata,
  ) {
    return this.orchestratorUseCase.runUserRegistrationSaga(payload, metadata);
  }

  @GrpcMethod('OrchestratorService', 'userLoginSaga')
  async userLoginSaga(payload: UserLoginSagaPayload, metadata: Metadata) {
    return this.orchestratorUseCase.runUserLoginSaga(payload, metadata);
  }

  @GrpcMethod('OrchestratorService', 'userCreationSaga')
  async userCreationSaga(payload: UserCreationSagaPayload, metadata: Metadata) {
    return this.orchestratorUseCase.runUserCreationSaga(payload, metadata);
  }

  @GrpcMethod('OrchestratorService', 'userDeletionSaga')
  async userDeletionSaga(payload: UserDeletionSagaPayload, metadata: Metadata) {
    return this.orchestratorUseCase.runUserDeletionSaga(payload, metadata);
  }

  @GrpcMethod('OrchestratorService', 'addClientsToProjectsSaga')
  addClientsToProjectsSaga(
    payload: AddClientsToProjectsSagaPayload,
    metadata: Metadata,
  ): Promise<AddClientsToProjectsSagaResult> {
    return this.orchestratorUseCase.runAddClientToProjectSaga(
      payload,
      metadata,
    );
  }

  @GrpcMethod('OrchestratorService', 'removeClientsFromProjectsSaga')
  removeClientsFromProjectsSaga(
    payload: RemoveClientsFromProjectsSagaPayload,
    metadata: Metadata,
  ): Promise<RemoveClientsFromProjectsSagaResult> {
    return this.orchestratorUseCase.runRemoveClientFromProjectSaga(
      payload,
      metadata,
    );
  }

  @GrpcMethod('OrchestratorService', 'createProjectSaga')
  createProjectSaga(
    payload: CreateProjectSagaPayload,
    metadata: Metadata,
  ): Promise<CreateProjectSagaResult> | Observable<CreateProjectSagaResult> {
    return this.orchestratorUseCase.runCreateProjectSaga(payload, metadata);
  }

  @GrpcMethod('OrchestratorService', 'deleteProjectSaga')
  deleteProjectSaga(
    payload: DeleteProjectSagaPayload,
    metadata: Metadata,
  ): Promise<DeleteProjectSagaResult> | Observable<DeleteProjectSagaResult> {
    return this.orchestratorUseCase.runDeleteProjectSaga(payload, metadata);
  }
}
