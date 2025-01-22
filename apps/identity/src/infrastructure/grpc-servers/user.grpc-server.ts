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
  AuthorizedUserPayload,
} from 'libs/interfaces';
import { Metadata } from '@grpc/grpc-js';
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
  async createUser(
    payload: CreateUserPayload,
    metadata: Metadata,
  ): Promise<GetUserResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    const user = await this.userUseCase.create(payload, authorizedUser);

    return {
      user,
    };
  }

  @GrpcMethod('IdentityService', 'listUsers')
  listUsers(
    payload: ListUserPayload,
    metadata: Metadata,
  ): Promise<ListUsersResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.userUseCase.list(payload, authorizedUser);
  }

  @GrpcMethod('IdentityService', 'getUser')
  getUser(
    payload: GetUserPayload,
    metadata: Metadata,
  ): Promise<GetUserResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.userUseCase.get(payload, authorizedUser);
  }

  @GrpcMethod('IdentityService', 'getUserOrFail')
  async getUserOrFail(
    payload: GetUserPayload,
    metadata: Metadata,
  ): Promise<GetUserResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    return this.userUseCase.getOrFail(payload, authorizedUser);
  }

  @GrpcMethod('IdentityService', 'deleteUser')
  async deleteUser(
    payload: DeleteUserPayload,
    metadata: Metadata,
  ): Promise<GetUserResponse> {
    const authorizedUser = <AuthorizedUserPayload>(
      JSON.parse(metadata.get('User').toString())
    );

    const user = await this.userUseCase.delete(payload, authorizedUser);

    return {
      user,
    };
  }
}
