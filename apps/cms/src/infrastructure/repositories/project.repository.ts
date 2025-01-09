import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Project } from '@prisma/client';
import { PRISMA_SERVICE, ProjectRepositorySign } from '../../domain';

@Injectable()
export class ProjectRepository implements ProjectRepositorySign {
  constructor(@Inject(PRISMA_SERVICE) private prismaService: PrismaService) {}
  create(
    payload: Pick<
      Prisma.ProjectCreateInput,
      'title' | 'description' | 'tenantId'
    >,
    transactionClient = this.prismaService,
  ): Promise<Project> {
    return transactionClient.project.create({
      data: {
        ...payload,
      },
    });
  }

  async findFirst(
    payload: Prisma.ProjectWhereInput,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>> {
    return this.prismaService.project.findFirst({
      where: { ...payload },
      include: { tickets: true },
    });
  }

  async findUnique(
    payload: Prisma.ProjectWhereUniqueInput,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>> {
    return this.prismaService.project.findUnique({
      where: { ...payload },
      include: { tickets: true },
    });
  }

  async findAll(
    payload: Prisma.ProjectWhereInput,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>[]> {
    return this.prismaService.project.findMany({
      where: { ...payload },
      include: { tickets: true },
    });
  }

  async update(
    id: number,
    payload: Prisma.ProjectUpdateInput,
    transactionClient = this.prismaService,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>> {
    return transactionClient.project.update({
      where: {
        id,
      },
      data: {
        ...payload,
      },
      include: {
        tickets: true,
      },
    });
  }

  async delete(
    payload: Pick<Prisma.ProjectWhereInput, 'id' | 'tenantId'>,
    transactionClient = this.prismaService,
  ): Promise<Prisma.ProjectGetPayload<{ include: { tickets: true } }>> {
    const project = await transactionClient.project.findFirst({
      where: {
        ...payload,
      },
      include: {
        tickets: true,
      },
    });

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
