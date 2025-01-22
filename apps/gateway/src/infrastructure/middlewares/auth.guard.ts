import {
  Injectable,
  CanActivate,
  ExecutionContext,
  createParamDecorator,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { RedisAdapter } from 'libs/adapters';
import { Reflector } from '@nestjs/core';
import { Prisma, UserType } from '@prisma/client';

export const AUTH_REQUIRED = 'auth_required';

export const AuthGuardRequired = (...userTypes: (UserType | '*')[]) =>
  SetMetadata(AUTH_REQUIRED, userTypes);

@Injectable()
export class AuthGuardInternal implements CanActivate {
  constructor(
    private readonly redisAdapter: RedisAdapter,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userTypeRequired = this.reflector.get<(UserType | '*')[]>(
      AUTH_REQUIRED,
      context.getHandler(),
    );

    if (!userTypeRequired) {
      return true;
    }

    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No Authorization header found');
    }
    const tokenKey = `accessToken:${authHeader}`;

    const userDataStr = await this.redisAdapter.getKey(tokenKey);

    if (!userDataStr) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const userData = <Prisma.UserGetPayload<{ include: { tenant: true } }>>(
      JSON.parse(userDataStr)
    );

    if (userTypeRequired.includes('*')) {
      request.authorizedUser = userData;

      return true;
    }

    if (!userTypeRequired.includes(userData.type)) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    request.authorizedUser = userData;

    return true;
  }
}

export const AuthorizedUser = createParamDecorator(
  (
    data,
    ctx: ExecutionContext,
  ): Prisma.UserGetPayload<{ include: { tenant: true } }> => {
    const req = ctx.switchToHttp().getRequest();
    return req.authorizedUser || null;
  },
);
