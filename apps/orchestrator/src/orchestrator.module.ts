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
  providers: [
    IdentityGrpcClient,
    OrchestratorUseCase,
    OrchestratorGrpcServer,
    CmsGrpcClient,
  ],
})
export class OrchestratorModule {}
