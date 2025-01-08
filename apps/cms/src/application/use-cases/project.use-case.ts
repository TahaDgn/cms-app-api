import { Inject, Injectable } from '@nestjs/common';
import {
  PRISMA_SERVICE,
  PrismaServiceSign,
  PROJECT_REPOSITORY,
  ProjectRepositorySign,
} from '../../domain';
import { CacheUseCase } from './cache.use-case';

@Injectable()
export class ProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepositorySign,
    @Inject(PRISMA_SERVICE)
    private readonly prismaService: PrismaServiceSign,
    private readonly cacheUseCase: CacheUseCase,
  ) {}
}
