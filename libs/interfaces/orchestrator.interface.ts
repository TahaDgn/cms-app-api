import { Tenant, User } from '@prisma/client';

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
}

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
