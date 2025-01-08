// apps/gateway/src/gateway.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { AuthGuardInternal } from './infrastructure/guards/auth.guard';
import { OrchestratorClient } from './infrastructure/grpc-clients/orchestrator.client';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [OrchestratorClient, AuthGuardInternal],
})
export class GatewayModule {}
