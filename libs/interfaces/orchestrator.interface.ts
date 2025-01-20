import { Tenant, User } from '@prisma/client';
import { GetUserResponse } from './identity.interface';
import {
  AddClientsToProjectsPayload,
  CreateProjectPayload,
  DeleteProjectPayload,
  GetProjectResponse,
  ListProjectsResponse,
  RemoveClientsFromProjectsPayload,
} from './cms.interface';
import { Observable } from 'rxjs';

export interface OrchestratorService {
  userRegistrationSaga(
    payload: UserRegistrationSagaPayload,
  ):
    | Promise<UserRegistrationSagaResult>
    | Observable<UserRegistrationSagaResult>;

  userLoginSaga(
    payload: UserLoginSagaPayload,
  ): Promise<UserLoginSagaResult> | Observable<UserLoginSagaResult>;

  userCreationSaga(
    payload: UserCreationSagaPayload,
  ): Promise<UserCreationSagaResult> | Observable<UserCreationSagaResult>;

  userDeletionSaga(
    payload: UserDeletionSagaPayload,
  ): Promise<UserDeletionSagaResult> | Observable<UserDeletionSagaResult>;

  addClientToProjectSaga(
    payload: AddClientToProjectSagaPayload,
  ):
    | Promise<AddClientToProjectSagaResult>
    | Observable<AddClientToProjectSagaResult>;

  removeClientFromProjectSaga(
    payload: RemoveClientFromProjectSagaPayload,
  ):
    | Promise<RemoveClientFromProjectSagaResult>
    | Observable<RemoveClientFromProjectSagaResult>;

  createProjectSaga(
    payload: CreateProjectSagaPayload,
  ): Promise<CreateProjectSagaResult> | Observable<CreateProjectSagaResult>;

  deleteProjectSaga(
    payload: DeleteProjectSagaPayload,
  ): Promise<DeleteProjectSagaResult> | Observable<DeleteProjectSagaResult>;
}

export type CreateProjectSagaPayload = CreateProjectPayload;

export type CreateProjectSagaResult = GetProjectResponse;

export type DeleteProjectSagaPayload = DeleteProjectPayload;

export type DeleteProjectSagaResult = GetProjectResponse;

export type AddClientToProjectSagaPayload = AddClientsToProjectsPayload;

export type AddClientToProjectSagaResult = ListProjectsResponse;

export type RemoveClientFromProjectSagaPayload =
  RemoveClientsFromProjectsPayload;

export type RemoveClientFromProjectSagaResult = ListProjectsResponse;

export interface UserRegistrationSagaPayload {
  tenant: Pick<Tenant, 'name' | 'identifier'>;
  user: Pick<User, 'name' | 'email' | 'type'>;
}

export type UserRegistrationSagaResult = void;

export interface UserLoginSagaPayload extends Pick<User, 'email'> {
  tenant: Pick<Tenant, 'identifier'>;
}

export type UserLoginSagaResult = void;

export type UserCreationSagaPayload = Pick<
  User,
  'tenantId' | 'name' | 'email' | 'type'
>;

export type UserCreationSagaResult = GetUserResponse;

export type UserDeletionSagaPayload = Pick<User, 'id' | 'tenantId'>;

export type UserDeletionSagaResult = GetUserResponse;
