import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import {
  TenantRepository,
  UserRepository,
} from './infrastructure/repositories';
import { RedisModule } from 'libs/adapters/redis';
import {
  AuthGrpcServer,
  TenantGrpcServer,
  UserGrpcServer,
} from './infrastructure';
import { PRISMA_SERVICE, TENANT_REPOSITORY, USER_REPOSITORY } from './domain';
import {
  AuthUseCase,
  CacheUseCase,
  TenantUseCase,
  UserUseCase,
} from './application';

@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: TENANT_REPOSITORY,
      useClass: TenantRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: PRISMA_SERVICE,
      useClass: PrismaService,
    },
    AuthUseCase,
    CacheUseCase,
    TenantUseCase,
    UserUseCase,
  ],
  controllers: [AuthGrpcServer, UserGrpcServer, TenantGrpcServer],
})
export class IdentityModule {}
