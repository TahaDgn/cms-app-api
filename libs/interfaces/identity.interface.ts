import { Prisma, Tenant, User } from '@prisma/client';
import { OneOf } from 'libs/shared-utils';

export interface IdentityService {
  createTenantAndUser(
    payload: CreateTenantAndUserPayload,
  ): Promise<CreateTenantAndUserResponse>;

  createAccessRequestLink(
    payload: AccessRequestPayload,
  ): Promise<AccessRequestResponse>;

  verifyAccessCode(payload: VerifyAccessPayload): Promise<VerifyAccessResponse>;

  createUser(payload: CreateUserPayload): Promise<CreateUserResponse>;

  listUsers(payload: ListUsersPayload): Promise<ListUsersResponse>;

  deleteUser(payload: DeleteUserPayload): Promise<DeleteUserResponse>;

  deleteTenant(payload: DeleteTenantPayload): Promise<DeleteTenantResponse>;

  removeAccessCode(
    payload: RemoveAccessCodePayload,
  ): Promise<RemoveAccessCodeResponse>;

  removeAccessToken(
    payload: RemoveAccessTokenPayload,
  ): Promise<RemoveAccessTokenResponse>;
}

export interface CreateTenantAndUserPayload {
  tenant: Pick<Tenant, 'name' | 'identifier'>;
  user: Pick<User, 'name' | 'email' | 'type'>;
}

export interface CreateTenantAndUserResponse {
  tenant: Tenant;
  user: User;
}

export type AccessRequestPayload = Pick<User, 'email'> &
  OneOf<{
    tenantId: number;
    tenantIdentifier: string;
  }>;

export interface AccessRequestResponse {
  accessUrl: string;
  accessCode: string;
  userName: string;
  userType: string;
  tenantName: string;
}

export interface VerifyAccessPayload {
  accessCode: string;
}

export interface VerifyAccessResponse {
  accessToken: string;
}

export type CreateUserPayload = Pick<
  User,
  'tenantId' | 'name' | 'email' | 'type'
>;

export type CreateUserResponse = Prisma.UserGetPayload<{
  include: {
    tenant: true;
  };
}>;

export interface ListUsersPayload {
  tenantId: number;
}

export interface ListUsersResponse {
  users: User[];
}

export type DeleteUserPayload = Pick<User, 'id' | 'tenantId'>;

export type DeleteTenantPayload = Pick<Tenant, 'id'>;

export type DeleteTenantResponse = Prisma.TenantGetPayload<{
  include: { users: true };
}>;

export type DeleteUserResponse = Prisma.UserGetPayload<{
  include: {
    tenant: true;
  };
}>;

export interface RemoveAccessCodePayload {
  accessCode: string;
}

export type RemoveAccessCodeResponse = void;

export interface RemoveAccessTokenPayload {
  accessToken: string;
}

export type RemoveAccessTokenResponse = void;
