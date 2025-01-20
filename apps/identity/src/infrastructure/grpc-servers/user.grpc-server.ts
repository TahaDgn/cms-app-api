import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserUseCase } from '../../application';
import {
  CreateUserPayload,
  DeleteUserPayload,
  IdentityService,
  GetUserResponse,
  ListUserPayload,
  ListUsersResponse,
  GetUserPayload,
} from 'libs/interfaces';
@Controller()
export class UserGrpcServer
  implements
    Pick<
      IdentityService,
      'createUser' | 'deleteUser' | 'listUsers' | 'getUser' | 'getUserOrFail'
    >
{
  constructor(private readonly userUseCase: UserUseCase) {}

  @GrpcMethod('IdentityService', 'createUser')
  createUser(payload: CreateUserPayload): Promise<GetUserResponse> {
    return this.userUseCase.create(payload);
  }

  @GrpcMethod('IdentityService', 'listUsers')
  listUsers(payload: ListUserPayload): Promise<ListUsersResponse> {
    return this.userUseCase.list(payload);
  }

  @GrpcMethod('IdentityService', 'getUser')
  getUser(payload: GetUserPayload): Promise<GetUserResponse> {
    return this.userUseCase.get(payload);
  }

  @GrpcMethod('IdentityService', 'getUserOrFail')
  getUserOrFail(payload: GetUserPayload): Promise<GetUserResponse> {
    return this.userUseCase.getOrFail(payload);
  }

  @GrpcMethod('IdentityService', 'deleteUser')
  deleteUser(payload: DeleteUserPayload): Promise<GetUserResponse> {
    return this.userUseCase.delete(payload);
  }
}
