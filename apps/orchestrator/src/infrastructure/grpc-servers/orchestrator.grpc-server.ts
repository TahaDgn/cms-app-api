import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrchestratorUseCase } from '../../application';
import {
  UserRegistrationSagaPayload,
  UserLoginSagaPayload,
  UserCreationSagaPayload,
  UserDeletionSagaPayload,
} from 'libs/interfaces';

@Controller()
export class OrchestratorGrpcServer {
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
}
