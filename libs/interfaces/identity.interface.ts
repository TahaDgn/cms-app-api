import { Prisma, Tenant, User } from '@prisma/client';
import { OneOf } from 'libs/shared-utils';
import { Observable } from 'rxjs';
import { PaginationPayload, TotalItemsCount } from './shared.interface';
import { Metadata } from '@grpc/grpc-js';

export interface IdentityService {
  createTenantWithOwner(
    payload: CreateTenantAndUserPayload,
    metadata: Metadata,
  ):
    | Promise<CreateTenantAndUserResponse>
    | Observable<CreateTenantAndUserResponse>;

  updateTenant(
    payload: UpdateTenantPayload,
    metadata: Metadata,
  ): Promise<GetTenantResponse> | Observable<GetTenantResponse>;

  incrementTenantProjectsCount(
    payload: IncrementTenantProjectsCountPayload,
    metadata: Metadata,
  ): Promise<GetTenantResponse> | Observable<GetTenantResponse>;

  decrementTenantProjectsCount(
    payload: DecrementTenantProjectsCountPayload,
    metadata: Metadata,
  ): Promise<GetTenantResponse> | Observable<GetTenantResponse>;

  deleteTenant(
    payload: DeleteTenantPayload,
    metadata: Metadata,
  ): Promise<GetTenantResponse> | Observable<GetTenantResponse>;

  createUser(
    payload: CreateUserPayload,
    metadata: Metadata,
  ): Promise<GetUserResponse> | Observable<GetUserResponse>;

  listUsers(
    payload: ListUserPayload,
    metadata: Metadata,
  ): Promise<ListUsersResponse> | Observable<ListUsersResponse>;

  getUserOrFail(
    payload: GetUserPayload,
    metadata: Metadata,
  ): Promise<GetUserResponse> | Observable<GetUserResponse>;

  getUser(
    payload: GetUserPayload,
    metadata: Metadata,
  ): Promise<GetUserResponse> | Observable<GetUserResponse>;

  deleteUser(
    payload: DeleteUserPayload,
    metadata: Metadata,
  ): Promise<GetUserResponse> | Observable<GetUserResponse>;

  createAccessRequestLink(
    payload: AccessRequestPayload,
    metadata: Metadata,
  ): Promise<AccessRequestResponse> | Observable<AccessRequestResponse>;

  verifyAccessCode(
    payload: VerifyAccessPayload,
    metadata: Metadata,
  ): Promise<VerifyAccessResponse> | Observable<VerifyAccessResponse>;

  removeAccessCode(
    payload: RemoveAccessCodePayload,
    metadata: Metadata,
  ): Promise<RemoveAccessCodeResponse> | Observable<RemoveAccessCodeResponse>;

  removeAccessToken(
    payload: RemoveAccessTokenPayload,
    metadata: Metadata,
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

export type IncrementTenantProjectsCountPayload = void;

export type DecrementTenantProjectsCountPayload = void;

export type GetTenantResponse = Prisma.TenantGetPayload<{
  include: { users: true };
}>;

export type UpdateTenantPayload = Pick<Tenant, 'id' | 'name' | 'identifier'>;

export type DeleteTenantPayload = {
  id: number;
};

export type CreateUserPayload = Pick<User, 'name' | 'email' | 'type'>;

export type GetUserPayload = {
  where: Prisma.UserWhereInput;
};

export type GetUserResponse = {
  user: Prisma.UserGetPayload<{
    include: {
      tenant: true;
    };
  }>;
};

export interface ListUserPayload extends PaginationPayload {
  where: Prisma.UserWhereInput;
}

export interface ListUsersResponse extends TotalItemsCount {
  users: User[];
}

export type DeleteUserPayload = Pick<User, 'id'>;

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
