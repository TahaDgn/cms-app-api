import { Inject, Injectable } from '@nestjs/common';
import {
  PROJECT_REPOSITORY,
  ProjectRepositorySign,
  TICKET_REPOSITORY,
  TicketRepositorySign,
} from '../../domain';
import { CacheUseCase } from './cache.use-case';

@Injectable()
export class TicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepositorySign,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositorySign,
    private readonly cacheUseCase: CacheUseCase,
  ) {}

  
}
