import { Module } from '@nestjs/common';
import { RabbitMQModule } from 'libs/adapters';
import { RedisModule } from 'libs/adapters/redis';
import {
  CmsGrpcClient,
  IdentityGrpcClient,
  OrchestratorUseCase,
} from './application';
import { OrchestratorGrpcServer } from './infrastructure';

@Module({
  imports: [RabbitMQModule, RedisModule],
  providers: [IdentityGrpcClient, CmsGrpcClient, OrchestratorUseCase],
  controllers: [OrchestratorGrpcServer],
  exports: [IdentityGrpcClient, CmsGrpcClient, OrchestratorUseCase],
})
export class OrchestratorModule {}
