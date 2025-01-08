import { Module } from '@nestjs/common';
import { OrchestratorServer } from './infrastructure/grpc/orchestrator.server';
import { OrchestratorService } from './application/use-cases';
import { IdentityClient, CmsClient } from './application/clients';
import { RabbitMQModule } from 'libs/adapters'; // Notification'a fire-and-forget
import { RedisModule } from 'libs/adapters/redis';

@Module({
  imports: [RabbitMQModule, RedisModule],
  providers: [
    OrchestratorServer,
    OrchestratorService,
    IdentityClient,
    CmsClient,
  ],
})
export class OrchestratorModule {}
