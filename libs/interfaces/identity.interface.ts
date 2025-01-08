import { Prisma, Tenant, User } from '@prisma/client';
import { OneOf } from 'libs/shared-utils';

export interface IdentityService {
  createTenantWithOwner(
    payload: CreateTenantAndUserPayload,
  ): Promise<CreateTenantAndUserResponse>;

  createAccessRequestLink(
    payload: AccessRequestPayload,
  ): Promise<AccessRequestResponse>;

  verifyAccessCode(payload: VerifyAccessPayload): Promise<VerifyAccessResponse>;

  createUserIfNotExists(
    payload: CreateUserPayload,
  ): Promise<UserWithTenantResponse>;

  listUsers(payload: ListUserPayload): Promise<ListUsersResponse>;

  getUser(payload: GetUserPayload): Promise<UserWithTenantResponse>;

  deleteUser(payload: DeleteUserPayload): Promise<UserWithTenantResponse>;

  deleteTenant(payload: DeleteTenantPayload): Promise<TenantWithUsersResponse>;

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
  tenantIdentifier: string;
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

export type ListUserPayload = Pick<User, 'tenantId'>;
export interface ListUsersResponse {
  users: User[];
}

export type GetUserPayload = Pick<User, 'id' | 'tenantId'>;

export type DeleteUserPayload = Pick<User, 'id' | 'tenantId'>;

export type DeleteTenantPayload = Pick<Tenant, 'id'>;

export type TenantWithUsersResponse = Prisma.TenantGetPayload<{
  include: { users: true };
}>;

export type UserWithTenantResponse = Prisma.UserGetPayload<{
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
