// apps/identity/src/identity.module.ts
import { Module } from '@nestjs/common';
import { IdentityServer } from './infrastructure/grpc/identity.server';
import { IdentityServiceApp } from './application/identity.service';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import {
  TenantRepository,
  UserRepository,
} from './infrastructure/repositories';
import { RedisModule } from 'libs/adapters/redis';

@Module({
  imports: [RedisModule],
  providers: [
    IdentityServer,
    IdentityServiceApp,
    PrismaService,
    TenantRepository,
    UserRepository,
  ],
})
export class IdentityModule {}
