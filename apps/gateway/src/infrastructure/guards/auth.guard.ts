// apps/gateway/src/infrastructure/guards/auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  createParamDecorator,
  applyDecorators,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RedisAdapter } from 'libs/adapters';
import { Reflector } from '@nestjs/core';

export const AUTH_REQUIRED = 'auth_required';

export function AuthGuard(userType?: string) {
  return applyDecorators(
    SetMetadata(AUTH_REQUIRED, userType),
    UseGuards(AuthGuardInternal),
  );
}

@Injectable()
export class AuthGuardInternal implements CanActivate {
  constructor(
    private readonly redisAdapter: RedisAdapter,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userTypeRequired = this.reflector.get<string>(
      AUTH_REQUIRED,
      context.getHandler(),
    );

    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('No Authorization header found');
    }
    const tokenKey = `accessToken:${authHeader}`;
    const userDataStr = await this.redisAdapter.getKey(tokenKey);
    if (!userDataStr) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const userData = JSON.parse(userDataStr);

    // userData = { email, issues, tenantId, tenantIssues, tenantOwnerId, type? }
    if (userTypeRequired && userData.type !== userTypeRequired) {
      throw new UnauthorizedException('User type not permitted');
    }

    request.authorizedUser = userData;
    return true;
  }
}

// Param Decorator
export const AuthorizedUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.authorizedUser || null;
  },
);
