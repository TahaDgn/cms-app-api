// apps/identity/src/application/identity.service.ts
import { Injectable } from '@nestjs/common';
import {
  AccessRequestPayload,
  CreateTenantAndUserPayload,
  CreateUserPayload,
  DeleteUserPayload,
} from 'libs/interfaces';
import {
  TenantRepository,
  UserRepository,
} from '../infrastructure/repositories';
import { RedisAdapter } from 'libs/adapters/redis';
import { REDIS_EXPIRE_5_MIN } from 'libs/constants';
import { generateRandomString } from 'libs/shared-utils';

@Injectable()
export class IdentityServiceApp {
  constructor(
    private readonly tenantRepo: TenantRepository,
    private readonly userRepo: UserRepository,
    private readonly redis: RedisAdapter,
  ) {}

  async createTenantAndUser(payload: CreateTenantAndUserPayload) {
    const tenant = await this.tenantRepo.createTenant(
      payload.tenantName,
      payload.tenantIdentifier,
    );

    const user = await this.userRepo.createUser(
      tenant.id,
      payload.email,
      payload.name,
      payload.userType,
    );

    await this.tenantRepo.setOwner(tenant.id, user.id);

    return { userId: user.id };
  }

  async createAccessRequestLink(payload: AccessRequestPayload) {
    const { email, tenantIdentifier } = payload;
    // user bul
    const user = await this.userRepo.findByEmailAndTenantIdentifier(
      email,
      tenantIdentifier,
    );
    if (!user) {
      throw new Error('User not found');
    }

    const code = generateRandomString(100);
    const codeKey = `accessRequestCode:${code}`;
    await this.redis.setKey(codeKey, user.id.toString(), REDIS_EXPIRE_5_MIN);

    const accessUrl = `http://api.cms-app/auth/access-request?code=${code}`;
    return { accessUrl };
  }

  async verifyAccessCode({ code }) {
    const codeKey = `accessRequestCode:${code}`;
    const val = await this.redis.getKey(codeKey);
    if (!val) {
      throw new Error('Invalid or expired code');
    }
    const userId = parseInt(val, 10);
    await this.redis.delKey(codeKey);

    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error('User not found');

    await this.userRepo.removeFirstLoginIssue(userId);

    const token = generateRandomString(1000);
    const tokenKey = `accessToken:${token}`;
    const userData = {
      email: user.email,
      issues: user.issues,
      tenantId: user.tenantId,
      type: user.type,
    };
    await this.redis.setKey(tokenKey, JSON.stringify(userData), 60 * 60);

    return { accessToken: token };
  }

  async createUserUnderTenant(payload: CreateUserPayload) {
    // createUser
    const user = await this.userRepo.createUser(
      payload.tenantId,
      payload.email,
      payload.name,
      payload.userType,
    );
    // Tenant counts update
    if (user.type === 'CLIENT') {
      await this.tenantRepo.incrementClientCount(payload.tenantId);
    } else {
      await this.tenantRepo.incrementParticipantCount(payload.tenantId);
    }
    return { userId: user.id };
  }

  async listTenantUsers(tenantId: number) {
    const users = await this.userRepo.findAllByTenant(tenantId);
    return { users };
  }

  async deleteUser(payload: DeleteUserPayload) {
    const { id: userId, tenantId } = payload;
    const user = await this.userRepo.findById(userId);
    if (!user || user.tenantId !== tenantId) {
      throw new Error('User not found or mismatch tenant');
    }
    await this.userRepo.deleteUser(userId);
    if (user.type === 'CLIENT') {
      await this.tenantRepo.decrementClientCount(tenantId);
    } else {
      await this.tenantRepo.decrementParticipantCount(tenantId);
    }
    return {
      deletedUserId: userId,
      userEmail: user.email,
      userType: user.type,
    };
  }
}
