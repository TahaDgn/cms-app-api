import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, UserIssue } from '@prisma/client';
import { UserRepositorySign } from '../../domain';

@Injectable()
export class UserRepository implements UserRepositorySign {
  constructor(private prisma: PrismaService) {}

  async create(
    payload: Pick<Prisma.UserCreateInput, 'email' | 'name' | 'type' | 'tenant'>,
    transactionClient = this.prisma,
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
    const user = await this.prisma.user.findFirst({
      ...payload,
    });

    return user as Prisma.UserGetPayload<{ include: { tenant: true } }>;
  }

  async findUnique(payload: Prisma.UserFindUniqueArgs) {
    const user = await this.prisma.user.findUnique({
      ...payload,
    });

    return user as Prisma.UserGetPayload<{ include: { tenant: true } }>;
  }

  async findAll(payload: Prisma.UserFindManyArgs) {
    const users = await this.prisma.user.findMany({
      ...payload,
    });

    return users as Prisma.UserGetPayload<{ include: { tenant: true } }>[];
  }

  async removeFirstLoginIssue(
    payload: Pick<Prisma.UserWhereUniqueInput, 'id' | 'tenantId'>,
    transactionClient = this.prisma,
  ) {
    const user = await this.findFirst({
      where: {
        ...payload,
      },
    });

    if (!user) return;

    const updatedIssues = user.issues.filter(
      (issue) => issue !== UserIssue.FIRST_LOGIN_WAS_NOT_MADE.toString(),
    );

    const { id } = payload;

    await transactionClient.user.update({
      where: {
        id,
      },
      data: {
        issues: updatedIssues,
      },
    });
  }

  async delete(
    payload: Pick<Prisma.UserWhereInput, 'id' | 'tenantId'>,
    transactionClient = this.prisma,
  ) {
    const user = await this.findFirst({
      where: {
        ...payload,
      },
    });

    if (!user) return;

    const { id } = user;

    return transactionClient.user.delete({
      where: {
        id,
      },
      include: {
        tenant: true,
      },
    });
  }
}
