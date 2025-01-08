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
  GetUserResponse,
  GetUserPayload,
} from 'libs/interfaces';

@Controller()
export class UserGrpcServer
  implements
    Pick<IdentityService, 'createUser' | 'deleteUser' | 'listUsers' | 'getUser'>
{
  constructor(private readonly userUseCase: UserUseCase) {}

  @GrpcMethod('IdentityService', 'createUser')
  createUser(payload: CreateUserPayload): Promise<UserWithTenantResponse> {
    return this.userUseCase.create(payload);
  }

  @GrpcMethod('IdentityService', 'listUsers')
  listUsers(payload: ListUserPayload): Promise<ListUsersResponse> {
    return this.userUseCase.list(payload);
  }

  @GrpcMethod('IdentityService', 'getUser')
  getUser(payload: GetUserPayload): Promise<GetUserResponse> {
    return this.userUseCase.getOrFail(payload);
  }

  @GrpcMethod('IdentityService', 'deleteUser')
  deleteUser(payload: DeleteUserPayload) {
    return this.userUseCase.delete(payload);
  }
}
