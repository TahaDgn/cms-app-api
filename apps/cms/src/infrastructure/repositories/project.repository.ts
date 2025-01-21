import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PRISMA_SERVICE, ProjectRepositorySign } from '../../domain';

@Injectable()
export class ProjectRepository implements ProjectRepositorySign {
  constructor(@Inject(PRISMA_SERVICE) private prismaService: PrismaService) {}

  async create(
    payload: Prisma.ProjectCreateArgs,
    transactionClient = this.prismaService,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>> {
    return <Prisma.ProjectGetPayload<{ include: { tickets: true } }>>(
      (<unknown>transactionClient.project.create(payload))
    );
  }

  async findFirst(
    payload: Prisma.ProjectFindFirstArgs,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>> {
    return <Prisma.ProjectGetPayload<{ include: { tickets: true } }>>(
      (<unknown>this.prismaService.project.findFirst(payload))
    );
  }

  async findUnique(
    payload: Prisma.ProjectFindUniqueArgs,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>> {
    return <Prisma.ProjectGetPayload<{ include: { tickets: true } }>>(
      (<unknown>this.prismaService.project.findUnique(payload))
    );
  }

  async findAll(
    payload: Prisma.ProjectFindManyArgs,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>[]> {
    return <Prisma.ProjectGetPayload<{ include: { tickets: true } }>[]>(
      (<unknown>this.prismaService.project.findMany(payload))
    );
  }

  async update(
    payload: Prisma.ProjectUpdateArgs,
    transactionClient = this.prismaService,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>> {
    return <Prisma.ProjectGetPayload<{ include: { tickets: true } }>>(
      (<unknown>transactionClient.project.update(payload))
    );
  }

  count(payload: Prisma.ProjectCountArgs): Promise<number> {
    return this.prismaService.project.count(payload);
  }

  async delete(
    payload: Prisma.ProjectDeleteArgs,
    transactionClient = this.prismaService,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>> {
    const { where } = payload;

    const project = <Prisma.ProjectGetPayload<{ include: { tickets: true } }>>(
      (<unknown>await transactionClient.project.findFirst({
        where,
        include: {
          tickets: true,
        },
      }))
    );

    if (!project) return;

    const { id } = project;

    await transactionClient.project.delete({
      where: {
        id,
      },
    });

    return project;
  }
}
