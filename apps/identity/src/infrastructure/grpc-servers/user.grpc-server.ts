// apps/identity/src/infrastructure/grpc/identity.server.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserUseCase } from '../../application';
import {
  CreateUserPayload,
  DeleteUserPayload,
  IdentityService,
  UserWithTenantResponse,
  ListUserPayload,
  ListUsersResponse,
  GetUserPayload,
} from 'libs/interfaces';

@Controller()
export class UserGrpcServer
  implements
    Pick<
      IdentityService,
      'createUserIfNotExists' | 'deleteUser' | 'listUsers' | 'getUser'
    >
{
  constructor(private readonly userUseCase: UserUseCase) {}

  @GrpcMethod('IdentityService', 'createUserIfNotExists')
  createUserIfNotExists(
    payload: CreateUserPayload,
  ): Promise<UserWithTenantResponse> {
    return this.userUseCase.createUserIfNotExists(payload);
  }

  @GrpcMethod('IdentityService', 'listUsers')
  listUsers(payload: ListUserPayload): Promise<ListUsersResponse> {
    return this.userUseCase.list(payload);
  }

  @GrpcMethod('IdentityService', 'getUser')
  getUser(payload: GetUserPayload): Promise<UserWithTenantResponse> {
    return this.userUseCase.getOrFail(payload);
  }

  @GrpcMethod('IdentityService', 'deleteUser')
  deleteUser(payload: DeleteUserPayload): Promise<UserWithTenantResponse> {
    return this.userUseCase.delete(payload);
  }
}
