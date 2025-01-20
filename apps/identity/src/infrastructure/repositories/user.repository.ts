import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, UserIssue } from '@prisma/client';
import { PRISMA_SERVICE, UserRepositorySign } from '../../domain';

@Injectable()
export class UserRepository implements UserRepositorySign {
  constructor(@Inject(PRISMA_SERVICE) private prismaService: PrismaService) {}

  async create(
    payload: Pick<Prisma.UserCreateInput, 'email' | 'name' | 'type' | 'tenant'>,
    transactionClient = this.prismaService,
  ): Promise<Prisma.UserGetPayload<{ include: { tenant: true } }>> {
    return transactionClient.user.create({
      data: {
        ...payload,
      },
      include: {
        tenant: true,
      },
    });
  }

  async findFirst(payload: Prisma.UserFindFirstArgs) {
    const user = await this.prismaService.user.findFirst({
      ...payload,
    });

    return user as Prisma.UserGetPayload<{ include: { tenant: true } }>;
  }

  async findUnique(payload: Prisma.UserFindUniqueArgs) {
    const user = await this.prismaService.user.findUnique({
      ...payload,
    });

    return user as Prisma.UserGetPayload<{ include: { tenant: true } }>;
  }

  async findAll(payload: Prisma.UserFindManyArgs) {
    const users = await this.prismaService.user.findMany({
      ...payload,
    });

    return users as Prisma.UserGetPayload<{ include: { tenant: true } }>[];
  }

  async removeFirstLoginIssue(
    payload: Pick<User, 'id' | 'tenantId'>,
    transactionClient = this.prismaService,
  ) {
    const { id, tenantId } = payload;

    const user = await this.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    const { issues } = user;

    const modifiedIssues = issues.filter(
      (issue) => issue !== UserIssue.FIRST_LOGIN_WAS_NOT_MADE,
    );

    return transactionClient.user.update({
      where: {
        id,
        tenantId,
      },
      data: {
        issues: modifiedIssues,
      },
      include: {
        tenant: true,
      },
    });
  }

  async count(payload: Prisma.UserCountArgs): Promise<number> {
    return this.prismaService.user.count(payload);
  }

  async delete(
    payload: Prisma.UserDeleteArgs,
    transactionClient = this.prismaService,
  ) {
    return transactionClient.user.delete({
      ...payload,
      include: {
        tenant: true,
      },
    });
  }
}
