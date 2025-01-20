import { Prisma, Tenant, User } from '@prisma/client';
import { OneOf } from 'libs/shared-utils';
import { Observable } from 'rxjs';
import { TotalItemsCount } from './shared.interface';

export interface IdentityService {
  createTenantWithOwner(
    payload: CreateTenantAndUserPayload,
  ):
    | Promise<CreateTenantAndUserResponse>
    | Observable<CreateTenantAndUserResponse>;

  updateTenant(
    payload: UpdateTenantPayload,
  ): Promise<GetTenantResponse> | Observable<GetTenantResponse>;

  incrementTenantProjectsCount(
    payload: IncrementTenantProjectsCountPayload,
  ): Promise<GetTenantResponse> | Observable<GetTenantResponse>;

  decrementTenantProjectsCount(
    payload: DecrementTenantProjectsCountPayload,
  ): Promise<GetTenantResponse> | Observable<GetTenantResponse>;

  deleteTenant(
    payload: DeleteTenantPayload,
  ): Promise<GetTenantResponse> | Observable<GetTenantResponse>;

  createUser(
    payload: CreateUserPayload,
  ): Promise<GetUserResponse> | Observable<GetUserResponse>;

  listUsers(
    payload: ListUserPayload,
  ): Promise<ListUsersResponse> | Observable<ListUsersResponse>;

  getUserOrFail(
    payload: GetUserPayload,
  ): Promise<GetUserResponse> | Observable<GetUserResponse>;

  getUser(
    payload: GetUserPayload,
  ): Promise<GetUserResponse> | Observable<GetUserResponse>;

  deleteUser(
    payload: DeleteUserPayload,
  ): Promise<GetUserResponse> | Observable<GetUserResponse>;

  createAccessRequestLink(
    payload: AccessRequestPayload,
  ): Promise<AccessRequestResponse> | Observable<AccessRequestResponse>;

  verifyAccessCode(
    payload: VerifyAccessPayload,
  ): Promise<VerifyAccessResponse> | Observable<VerifyAccessResponse>;

  removeAccessCode(
    payload: RemoveAccessCodePayload,
  ): Promise<RemoveAccessCodeResponse> | Observable<RemoveAccessCodeResponse>;

  removeAccessToken(
    payload: RemoveAccessTokenPayload,
  ): Promise<RemoveAccessTokenResponse> | Observable<RemoveAccessTokenResponse>;
}

export interface CreateTenantAndUserPayload {
  tenant: Pick<Tenant, 'name' | 'identifier'>;
  user: Pick<User, 'name' | 'email' | 'type'>;
}

export interface CreateTenantAndUserResponse {
  tenant: Tenant;
  user: User;
}

export type IncrementTenantProjectsCountPayload = Pick<Tenant, 'id'>;

export type DecrementTenantProjectsCountPayload = Pick<Tenant, 'id'>;

export type GetTenantResponse = Prisma.TenantGetPayload<{
  include: { users: true };
}>;

export type UpdateTenantPayload = Pick<Tenant, 'id' | 'name' | 'identifier'>;

export type DeleteTenantPayload = {
  id: number;
};

export type CreateUserPayload = Pick<
  User,
  'tenantId' | 'name' | 'email' | 'type'
>;

export type GetUserPayload = Prisma.UserFindFirstArgs;

export type GetUserResponse = Prisma.UserGetPayload<{
  include: {
    tenant: true;
  };
}>;

export type ListUserPayload = Prisma.UserFindManyArgs;

export interface ListUsersResponse extends TotalItemsCount {
  users: User[];
}

export type DeleteUserPayload = Pick<User, 'id' | 'tenantId'>;

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

export interface LogoutPayload {
  accessToken: string;
}

export type LogoutResponse = void;

export interface RemoveAccessCodePayload {
  accessCode: string;
}

export type RemoveAccessCodeResponse = void;

export interface RemoveAccessTokenPayload {
  accessToken: string;
}

export type RemoveAccessTokenResponse = void;
