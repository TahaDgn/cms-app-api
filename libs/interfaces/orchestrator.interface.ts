import { Project, Tenant, User } from '@prisma/client';
import { UserWithTenantResponse } from './identity.interface';

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

export interface AddClientToProjectSagaPayload {
  project: Pick<Project, 'id' | 'tenantId'>;
  user: Pick<User, 'email' | 'tenantId' | 'name' | 'type'>;
}

export type AddClientToProjectSagaResult = void;

export interface RemoveClientFromProjectSagaPayload {
  project: Pick<Project, 'id' | 'tenantId'>;
  user: Pick<User, 'id'>;
}

export type RemoveClientFromProjectSagaResult = void;

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

export type UserCreationSagaResult = UserWithTenantResponse;

export type UserDeletionSagaPayload = Pick<User, 'id' | 'tenantId'>;

export type UserDeletionSagaResult = UserWithTenantResponse;
