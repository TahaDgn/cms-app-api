import { Inject, Injectable } from '@nestjs/common';
import {
  PROJECT_REPOSITORY,
  ProjectRepositorySign,
  TICKET_REPOSITORY,
  TicketRepositorySign,
} from '../../domain';
import { CacheUseCase } from './cache.use-case';
import {
  CreateTicketPayload,
  DeleteTicketPayload,
  UpdateTicketPayload,
} from 'libs/interfaces';

@Injectable()
export class TicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepositorySign,
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositorySign,
    private readonly cacheUseCase: CacheUseCase,
  ) {}

  public async update(payload: UpdateTicketPayload) {
    const { id, ...restOfPayload } = payload;

    return this.ticketRepository.update(id, {
      ...restOfPayload,
    });
  }

  public async create(payload: CreateTicketPayload) {
    const { projectId, ...restOfPayload } = payload;

    return this.ticketRepository.create({
      ...restOfPayload,
      project: {
        connect: { id: projectId },
      },
    });
  }

  public async delete(payload: DeleteTicketPayload) {
    return this.ticketRepository.delete(payload);
  }
}
