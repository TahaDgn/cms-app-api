import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrchestratorService } from '../../application/use-cases';
import {
  UserRegistrationSagaPayload,
  UserLoginSagaPayload,
  UserCreationSagaPayload,
  UserDeletionSagaPayload,
} from 'libs/interfaces';

@Controller()
export class OrchestratorServer {
  constructor(private readonly orchestratorService: OrchestratorService) {}

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
