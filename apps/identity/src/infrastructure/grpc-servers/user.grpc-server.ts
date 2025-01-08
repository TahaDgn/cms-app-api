// apps/identity/src/infrastructure/grpc/identity.server.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserUseCase } from '../../application';
import {
  CreateUserPayload,
  DeleteUserPayload,
  IdentityService,
  CreateUserResponse,
  ListUsersPayload,
  ListUsersResponse,
} from 'libs/interfaces';

@Controller()
export class UserGrpcServer
  implements Pick<IdentityService, 'createUser' | 'deleteUser' | 'listUsers'>
{
  constructor(private readonly userUseCase: UserUseCase) {}

  @GrpcMethod('IdentityService', 'createUser')
  createUser(payload: CreateUserPayload): Promise<CreateUserResponse> {
    return this.userUseCase.create(payload);
  }

  @GrpcMethod('IdentityService', 'listUsers')
  listUsers(payload: ListUsersPayload): Promise<ListUsersResponse> {
    return this.userUseCase.list(payload);
  }

  @GrpcMethod('IdentityService', 'deleteUser')
  deleteUser(payload: DeleteUserPayload) {
    return this.userUseCase.delete(payload);
  }
}
