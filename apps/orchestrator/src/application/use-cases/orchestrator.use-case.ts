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
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class OrchestratorUseCase {
  constructor(
    private readonly identityGrpcClient: IdentityGrpcClient,
    private readonly cmsGrpcClient: CmsGrpcClient,
    private readonly rabbitMqAdapter: RabbitMQAdapter,
  ) {}

  async runUserRegistrationSaga(
    payload: UserRegistrationSagaPayload,
    metadata: Metadata,
  ): Promise<void> {
    return userRegistrationSaga(
      this.identityGrpcClient,
      this.rabbitMqAdapter,
      payload,
      metadata,
    );
  }

  async runUserLoginSaga(
    payload: UserLoginSagaPayload,
    metadata: Metadata,
  ): Promise<void> {
    return userLoginSaga(
      this.identityGrpcClient,
      this.rabbitMqAdapter,
      payload,
      metadata,
    );
  }

  async runUserCreationSaga(
    payload: UserCreationSagaPayload,
    metadata: Metadata,
  ): Promise<UserCreationSagaResult> {
    return userCreationSaga(
      this.identityGrpcClient,
      this.rabbitMqAdapter,
      payload,
      metadata,
    );
  }

  async runUserDeletionSaga(
    payload: UserDeletionSagaPayload,
    metadata: Metadata,
  ): Promise<UserDeletionSagaResult> {
    return userDeletionSaga(
      this.identityGrpcClient,
      this.cmsGrpcClient,
      this.rabbitMqAdapter,
      payload,
      metadata,
    );
  }

  async runAddClientToProjectSaga(
    payload: AddClientsToProjectsSagaPayload,
    metadata: Metadata,
  ): Promise<AddClientsToProjectsSagaResult> {
    return addClientToProjectSaga(
      this.cmsGrpcClient,
      this.identityGrpcClient,
      this.rabbitMqAdapter,
      payload,
      metadata,
    );
  }

  async runRemoveClientFromProjectSaga(
    payload: RemoveClientsFromProjectsSagaPayload,
    metadata: Metadata,
  ): Promise<RemoveClientsFromProjectsSagaResult> {
    return removeClientFromProjectSaga(
      this.cmsGrpcClient,
      this.identityGrpcClient,
      this.rabbitMqAdapter,
      payload,
      metadata,
    );
  }

  async runCreateProjectSaga(
    payload: CreateProjectSagaPayload,
    metadata: Metadata,
  ): Promise<CreateProjectSagaResult> {
    return createProjectSaga(
      this.cmsGrpcClient,
      this.identityGrpcClient,
      this.rabbitMqAdapter,
      payload,
      metadata,
    );
  }

  async runDeleteProjectSaga(
    payload: DeleteProjectSagaPayload,
    metadata: Metadata,
  ): Promise<DeleteProjectSagaResult> {
    return deleteProjectSaga(
      this.cmsGrpcClient,
      this.identityGrpcClient,
      this.rabbitMqAdapter,
      payload,
      metadata,
    );
  }
}
