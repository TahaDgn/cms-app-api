import { Injectable } from '@nestjs/common';
import { IdentityGrpcClient } from '../clients';
import { RabbitMQAdapter } from 'libs/adapters';
import {
  UserRegistrationSagaPayload,
  UserLoginSagaPayload,
  UserCreationSagaPayload,
  UserDeletionSagaPayload,
  UserDeletionSagaResult,
  UserCreationSagaResult,
} from 'libs/interfaces';
import {
  userCreationSaga,
  userDeletionSaga,
  userLoginSaga,
  userRegistrationSaga,
} from '../sagas';

@Injectable()
export class OrchestratorService {
  constructor(
    private readonly identityGrpcClient: IdentityGrpcClient,
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
      this.rabbitMqAdapter,
      payload,
    );
  }
}
