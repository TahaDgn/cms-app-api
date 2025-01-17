import { Tenant, User } from '@prisma/client';
import { GetUserResponse } from './identity.interface';
import {
  AddClientsToProjectsPayload,
  ListProjectsResponse,
  RemoveClientsFromProjectsPayload,
} from './cms.interface';

export interface OrchestratorService {
  userRegistrationSaga(
    payload: UserRegistrationSagaPayload,
  ): Promise<UserRegistrationSagaResult>;

  userLoginSaga(payload: UserLoginSagaPayload): Promise<UserLoginSagaResult>;

  userCreationSaga(
    payload: UserCreationSagaPayload,
  ): Promise<UserCreationSagaResult>;

  userDeletionSaga(
    payload: UserDeletionSagaPayload,
  ): Promise<UserDeletionSagaResult>;

  addClientToProjectSaga(
    payload: AddClientToProjectSagaPayload,
  ): Promise<AddClientToProjectSagaResult>;

  removeClientFromProjectSaga(
    payload: RemoveClientFromProjectSagaPayload,
  ): Promise<RemoveClientFromProjectSagaResult>;
}

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
