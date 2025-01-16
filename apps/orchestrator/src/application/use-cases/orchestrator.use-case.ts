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
  AddClientToProjectSagaPayload,
  AddClientToProjectSagaResult,
  RemoveClientFromProjectSagaPayload,
  RemoveClientFromProjectSagaResult,
} from 'libs/interfaces';
import {
  addClientToProjectSaga,
  runRemoveClientFromProjectSaga,
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
    payload: AddClientToProjectSagaPayload,
  ): Promise<AddClientToProjectSagaResult> {
    return addClientToProjectSaga(
      this.cmsGrpcClient,
      this.identityGrpcClient,
      this.rabbitMqAdapter,
      payload,
    );
  }

  async runRemoveClientFromProjectSaga(
    payload: RemoveClientFromProjectSagaPayload,
  ): Promise<RemoveClientFromProjectSagaResult> {
    return runRemoveClientFromProjectSaga(
      this.cmsGrpcClient,
      this.identityGrpcClient,
      this.rabbitMqAdapter,
      payload,
    );
  }
}
