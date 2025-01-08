// apps/identity/src/identity.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { RedisModule } from 'libs/adapters/redis';
import { ProjectGrpcServer, TicketGrpcServer } from './infrastructure';
import {
  PRISMA_SERVICE,
  PROJECT_REPOSITORY,
  TICKET_REPOSITORY,
} from './domain';
import { CacheUseCase, ProjectUseCase, TicketUseCase } from './application';

@Module({
  imports: [RedisModule],
  providers: [
    ProjectGrpcServer,
    TicketGrpcServer,
    {
      provide: TICKET_REPOSITORY,
      useClass: TicketRepsitory,
    },
    {
      provide: PROJECT_REPOSITORY,
      useClass: ProjectRepository,
    },
    {
      provide: PRISMA_SERVICE,
      useClass: PrismaService,
    },
    CacheUseCase,
    ProjectUseCase,
    TicketUseCase,
  ],
})
export class CmsModule {}
