import { Module } from '@nestjs/common';
import {
  AuthController,
  AuthGuardInternal,
  CmsGrpcClient,
  IdentityGrpcClient,
  OrchestratorGrpcClient,
  ProjectController,
  TicketController,
  UserController,
} from './infrastructure';
import { APP_GUARD } from '@nestjs/core';
import { RabbitMQModule, RedisModule } from 'libs/adapters';

@Module({
  imports: [RedisModule, RabbitMQModule],
  controllers: [
    AuthController,
    UserController,
    ProjectController,
    TicketController,
  ],
  providers: [
    OrchestratorGrpcClient,
    IdentityGrpcClient,
    CmsGrpcClient,
    { provide: APP_GUARD, useClass: AuthGuardInternal },
  ],
})
export class GatewayModule {}
