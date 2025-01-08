import { Injectable } from '@nestjs/common';
import {
  AccessRequestResponse,
  RemoveAccessCodePayload,
  RemoveAccessCodeResponse,
  RemoveAccessTokenPayload,
  RemoveAccessTokenResponse,
  VerifyAccessResponse,
} from 'libs/interfaces';
import { RedisAdapter } from 'libs/adapters/redis';
import { REDIS_EXPIRE_5_MIN } from 'libs/constants';
import { generateRandomString } from 'libs/shared-utils';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class CacheUseCase {
  constructor(private readonly redisAdapter: RedisAdapter) {}

  public async getUserIdByAccessRequestCode(
    accessCode: string,
  ): Promise<number> {
    const accessRequestCodeKey = `accessRequestCode:${accessCode}`;

    const userIdValue = await this.redisAdapter.getKey(accessRequestCodeKey);

    if (!userIdValue) return;

    return parseInt(userIdValue, 10);
  }

  public async createAndCacheAccessToken(
    user: Prisma.UserGetPayload<{ include: { tenant: true } }>,
  ): Promise<Pick<VerifyAccessResponse, 'accessToken'>> {
    const accessToken = generateRandomString(1000);

    const accessTokenKey = `accessToken:${accessToken}`;

    const { id, tenantId } = user;

    const userAccessTokenKeysListKey = `tenant:${tenantId}:user:${id}:accessTokenCacheKeys`;

    await Promise.all([
      this.redisAdapter.lPush(userAccessTokenKeysListKey, accessTokenKey),
      this.redisAdapter.setKey(accessTokenKey, JSON.stringify(user), 60 * 60),
    ]);

    return {
      accessToken,
    };
  }

  public async createAndCacheAccessRequestCode(
    user: Pick<User, 'id'>,
  ): Promise<Pick<AccessRequestResponse, 'accessCode'>> {
    const { id } = user;

    const accessRequestCode = generateRandomString(100);

    const accessRequestCodeKey = `accessRequestCode:${accessRequestCode}`;

    await this.redisAdapter.setKey(
      accessRequestCodeKey,
      id.toString(),
      REDIS_EXPIRE_5_MIN,
    );

    return {
      accessCode: accessRequestCode,
    };
  }

  public async removeAccessCode(
    payload: RemoveAccessCodePayload,
  ): Promise<RemoveAccessCodeResponse> {
    const { accessCode } = payload;

    const accessRequestCodeKey = `accessRequestCode:${accessCode}`;

    await this.redisAdapter.delKey(accessRequestCodeKey);
  }

  public async removeAccessToken(
    payload: RemoveAccessTokenPayload,
  ): Promise<RemoveAccessTokenResponse> {
    const { accessToken } = payload;

    const accessTokenKey = `accessToken:${accessToken}`;

    await this.redisAdapter.delKey(accessTokenKey);
  }

  public async dropUserAccessTokens(user: Pick<User, 'id' | 'tenantId'>) {
    const { id, tenantId } = user;

    const userAccessTokenKeysListKey = `tenant:${tenantId}:user:${id}:accessTokenCacheKeys`;

    const accessTokenKeysList = await this.redisAdapter.lRange(
      userAccessTokenKeysListKey,
    );

    if (!accessTokenKeysList) {
      return;
    }

    await Promise.all(
      accessTokenKeysList.map(async (accessTokenKey) => {
        this.redisAdapter.delKey(accessTokenKey);
      }),
    );
  }
}
