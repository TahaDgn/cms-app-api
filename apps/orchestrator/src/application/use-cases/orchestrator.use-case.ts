import { Injectable } from '@nestjs/common';
import { CmsGrpcClient, IdentityGrpcClient } from '../../infrastructure';
import { RabbitMQAdapter } from 'libs/adapters';
import {
  UserRegistrationSagaPayload,
  UserLoginSagaPayload,
  UserCreationSagaPayload,
  UserDeletionSagaPayload,
  UserDeletionSagaResult,
  UserCreationSagaResult,
  AddClientsToProjectsSagaPayload,
  AddClientsToProjectsSagaResult,
  RemoveClientsFromProjectsSagaPayload,
  RemoveClientsFromProjectsSagaResult,
  CreateProjectSagaPayload,
  CreateProjectSagaResult,
  DeleteProjectSagaPayload,
  DeleteProjectSagaResult,
} from 'libs/interfaces';
import {
  addClientToProjectSaga,
  createProjectSaga,
  deleteProjectSaga,
  removeClientFromProjectSaga,
  userCreationSaga,
  userDeletionSaga,
  userLoginSaga,
  userRegistrationSaga,
} from '../sagas';

@Injectable()
export class OrchestratorUseCase {
  constructor(
    private readonly identityGrpcClient: IdentityGrpcClient,
    private readonly cmsGrpcClient: CmsGrpcClient,
    private readonly rabbitMqAdapter: RabbitMQAdapter,
  ) {}

  async runUserRegistrationSaga(
    payload: UserRegistrationSagaPayload,
  ): Promise<void> {
    return userRegistrationSaga(
      this.identityGrpcClient,
      this.rabbitMqAdapter,
      payload,
    );
  }

  async runUserLoginSaga(payload: UserLoginSagaPayload): Promise<void> {
    return userLoginSaga(
      this.identityGrpcClient,
      this.rabbitMqAdapter,
      payload,
    );
  }

  async runUserCreationSaga(
    payload: UserCreationSagaPayload,
  ): Promise<UserCreationSagaResult> {
    return userCreationSaga(
      this.identityGrpcClient,
      this.rabbitMqAdapter,
      payload,
    );
  }

  async runUserDeletionSaga(
    payload: UserDeletionSagaPayload,
  ): Promise<UserDeletionSagaResult> {
    return userDeletionSaga(
      this.identityGrpcClient,
      this.cmsGrpcClient,
      this.rabbitMqAdapter,
      payload,
    );
  }

  async runAddClientToProjectSaga(
    payload: AddClientsToProjectsSagaPayload,
  ): Promise<AddClientsToProjectsSagaResult> {
    return addClientToProjectSaga(
      this.cmsGrpcClient,
      this.identityGrpcClient,
      this.rabbitMqAdapter,
      payload,
    );
  }

  async runRemoveClientFromProjectSaga(
    payload: RemoveClientsFromProjectsSagaPayload,
  ): Promise<RemoveClientsFromProjectsSagaResult> {
    return removeClientFromProjectSaga(
      this.cmsGrpcClient,
      this.identityGrpcClient,
      this.rabbitMqAdapter,
      payload,
    );
  }

  async runCreateProjectSaga(
    payload: CreateProjectSagaPayload,
  ): Promise<CreateProjectSagaResult> {
    return createProjectSaga(
      this.cmsGrpcClient,
      this.identityGrpcClient,
      this.rabbitMqAdapter,
      payload,
    );
  }

  async runDeleteProjectSaga(
    payload: DeleteProjectSagaPayload,
  ): Promise<DeleteProjectSagaResult> {
    return deleteProjectSaga(
      this.cmsGrpcClient,
      this.identityGrpcClient,
      this.rabbitMqAdapter,
      payload,
    );
  }
}
