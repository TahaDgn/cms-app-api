import { Tenant, User } from '@prisma/client';
import {
  CreateTenantAndUserPayload,
  CreateUserPayload,
  DeleteUserPayload,
  GetUserResponse,
} from './identity.interface';
import {
  AddClientsToProjectsPayload,
  CreateProjectPayload,
  DeleteProjectPayload,
  GetProjectResponse,
  RemoveClientsFromProjectsPayload,
} from './cms.interface';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

export interface OrchestratorService {
  userRegistrationSaga(
    payload: UserRegistrationSagaPayload,
    metadata: Metadata,
  ):
    | Promise<UserRegistrationSagaResult>
    | Observable<UserRegistrationSagaResult>;

  userLoginSaga(
    payload: UserLoginSagaPayload,
    metadata: Metadata,
  ): Promise<UserLoginSagaResult> | Observable<UserLoginSagaResult>;

  userCreationSaga(
    payload: UserCreationSagaPayload,
    metadata: Metadata,
  ): Promise<UserCreationSagaResult> | Observable<UserCreationSagaResult>;

  userDeletionSaga(
    payload: UserDeletionSagaPayload,
    metadata: Metadata,
  ): Promise<UserDeletionSagaResult> | Observable<UserDeletionSagaResult>;

  addClientsToProjectsSaga(
    payload: AddClientsToProjectsSagaPayload,
    metadata: Metadata,
  ):
    | Promise<AddClientsToProjectsSagaResult>
    | Observable<AddClientsToProjectsSagaResult>;

  removeClientsFromProjectsSaga(
    payload: RemoveClientsFromProjectsSagaPayload,
    metadata: Metadata,
  ):
    | Promise<RemoveClientsFromProjectsSagaResult>
    | Observable<RemoveClientsFromProjectsSagaResult>;

  createProjectSaga(
    payload: CreateProjectSagaPayload,
    metadata: Metadata,
  ): Promise<CreateProjectSagaResult> | Observable<CreateProjectSagaResult>;

  deleteProjectSaga(
    payload: DeleteProjectSagaPayload,
    metadata: Metadata,
  ): Promise<DeleteProjectSagaResult> | Observable<DeleteProjectSagaResult>;
}

export type CreateProjectSagaPayload = CreateProjectPayload;

export type CreateProjectSagaResult = GetProjectResponse;

export type DeleteProjectSagaPayload = DeleteProjectPayload;

export type DeleteProjectSagaResult = GetProjectResponse;

export type AddClientsToProjectsSagaPayload = AddClientsToProjectsPayload;

export type AddClientsToProjectsSagaResult = GetProjectResponse;

export type RemoveClientsFromProjectsSagaPayload =
  RemoveClientsFromProjectsPayload;

export type RemoveClientsFromProjectsSagaResult = GetProjectResponse;

export type UserRegistrationSagaPayload = CreateTenantAndUserPayload;

export type UserRegistrationSagaResult = void;

export interface UserLoginSagaPayload extends Pick<User, 'email'> {
  tenant: Pick<Tenant, 'identifier'>;
}

export type UserLoginSagaResult = void;

export type UserCreationSagaPayload = CreateUserPayload;

export type UserCreationSagaResult = GetUserResponse;

export type UserDeletionSagaPayload = DeleteUserPayload;

export type UserDeletionSagaResult = GetUserResponse;
