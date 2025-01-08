import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AccessRequestPayload,
  VerifyAccessPayload,
  IdentityService,
  AccessRequestResponse,
  RemoveAccessCodePayload,
  RemoveAccessCodeResponse,
  RemoveAccessTokenPayload,
  RemoveAccessTokenResponse,
  VerifyAccessResponse,
} from 'libs/interfaces';
import { AuthUseCase, CacheUseCase } from '../../application';

@Controller()
export class AuthGrpcServer
  implements
    Pick<
      IdentityService,
      | 'createAccessRequestLink'
      | 'removeAccessCode'
      | 'removeAccessToken'
      | 'verifyAccessCode'
    >
{
  constructor(
    private readonly authUseCase: AuthUseCase,
    private readonly cacheUseCase: CacheUseCase,
  ) {}

  @GrpcMethod('IdentityService', 'createAccessRequestLink')
  createAccessRequestLink(
    payload: AccessRequestPayload,
  ): Promise<AccessRequestResponse> {
    return this.authUseCase.createAccessRequestLink(payload);
  }

  @GrpcMethod('IdentityService', 'removeAccessCode')
  removeAccessCode(
    payload: RemoveAccessCodePayload,
  ): Promise<RemoveAccessCodeResponse> {
    return this.cacheUseCase.removeAccessCode(payload);
  }

  @GrpcMethod('IdentityService', 'removeAccessToken')
  removeAccessToken(
    payload: RemoveAccessTokenPayload,
  ): Promise<RemoveAccessTokenResponse> {
    return this.cacheUseCase.removeAccessToken(payload);
  }

  @GrpcMethod('IdentityService', 'verifyAccessCode')
  verifyAccessCode(
    payload: VerifyAccessPayload,
  ): Promise<VerifyAccessResponse> {
    return this.authUseCase.verifyAccessCode(payload);
  }
}
