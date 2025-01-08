import { Project, Tenant, User } from '@prisma/client';

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

export type ProjectCreationSagaPayload = Pick<
  Project,
  'title' | 'description' | 'tenantId'
>;

export type ProjectCreationSagaResult = Project;

export type ProjectDeletionSagaPayload = Pick<Project, 'id' | 'tenantId'>;

export type ProjectDeletionSagaResult = Project;

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

export type SetNewStatusToProjectSagaPayload = Pick<Project, 'tenantId' | 'id'>;

export type SetNewStatusToProjectSagaResult = Project;

export interface UserRegistrationSagaPayload {
  tenant: Pick<Tenant, 'name' | 'identifier'>;
  user: Pick<User, 'name' | 'email' | 'type'>;
}

export type UserRegistrationSagaResult = void;

export interface UserLoginSagaPayload extends Pick<User, 'email'> {
  tenantIdentifier: string;
}

export type UserLoginSagaResult = void;

export type UserCreationSagaPayload = Pick<
  User,
  'tenantId' | 'name' | 'email' | 'type'
>;

export type UserCreationSagaResult = User;

export type UserDeletionSagaPayload = Pick<User, 'id' | 'tenantId'>;

export type UserDeletionSagaResult = User;
