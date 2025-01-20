import { Inject, Injectable } from '@nestjs/common';
import {
  AccessRequestPayload,
  AccessRequestResponse,
  VerifyAccessPayload,
  VerifyAccessResponse,
} from 'libs/interfaces';
import {
  AccessCodeInvalidException,
  USER_REPOSITORY,
  UserNotFoundException,
  UserRepositorySign,
} from '../../domain';
import { CacheUseCase } from './cache.use-case';
import { UserIssue } from '@prisma/client';

@Injectable()
export class AuthUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositorySign,
    private readonly cacheUseCase: CacheUseCase,
  ) {}

  public async createAccessRequestLink(
    payload: AccessRequestPayload,
  ): Promise<AccessRequestResponse> {
    const { email, tenantIdentifier, tenantId } = payload;

    const user = await this.userRepository.findFirst({
      where: {
        email,
        tenantId: tenantId || undefined,
        tenant: {
          identifier: tenantIdentifier || undefined,
        },
      },
      include: {
        tenant: true,
      },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    const {
      id,
      name: userName,
      type: userType,
      tenant: { name: tenantName },
    } = user;

    const { accessCode } =
      await this.cacheUseCase.createAndCacheAccessRequestCode({
        id,
      });

    const accessUrl = `http://api.cms-app/auth/access-request?code=${accessCode}`;

    return {
      accessCode,
      accessUrl,
      tenantName,
      userName,
      userType,
      tenantIdentifier,
    };
  }

  public async verifyAccessCode(
    payload: VerifyAccessPayload,
  ): Promise<VerifyAccessResponse> {
    const { accessCode } = payload;

    const userId =
      await this.cacheUseCase.getUserIdByAccessRequestCode(accessCode);

    if (!userId) {
      throw new AccessCodeInvalidException();
    }

    await this.cacheUseCase.removeAccessCode({ accessCode });

    const user = await this.userRepository.findUnique({
      where: {
        id: userId,
      },
      include: {
        tenant: true,
      },
    });

    if (!user) throw new UserNotFoundException();

    const { tenantId, issues } = user;

    if (issues.includes(UserIssue.FIRST_LOGIN_WAS_NOT_MADE)) {
      const updatedUser = await this.userRepository.removeFirstLoginIssue({
        id: userId,
        tenantId,
      });

      return this.cacheUseCase.createAndCacheAccessToken(updatedUser);
    }

    return this.cacheUseCase.createAndCacheAccessToken(user);
  }
}
