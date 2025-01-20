import { Inject, Injectable } from '@nestjs/common';
import {
  CreateTenantAndUserPayload,
  CreateTenantAndUserResponse,
  DecrementTenantProjectsCountPayload,
  DeleteTenantPayload,
  GetTenantResponse,
  IncrementTenantProjectsCountPayload,
  UpdateTenantPayload,
} from 'libs/interfaces';
import {
  PRISMA_SERVICE,
  PrismaServiceSign,
  TENANT_REPOSITORY,
  TenantRepositorySign,
  USER_REPOSITORY,
  UserRepositorySign,
} from '../../domain';
import { Prisma } from '@prisma/client';
import { CacheUseCase } from './cache.use-case';

@Injectable()
export class TenantUseCase {
  constructor(
    @Inject(PRISMA_SERVICE)
    private readonly prismaService: PrismaServiceSign,
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepositorySign,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositorySign,
    private readonly cacheUseCase: CacheUseCase,
  ) {}

  public async createWithOwner(
    payload: CreateTenantAndUserPayload,
  ): Promise<CreateTenantAndUserResponse> {
    const { tenant, user } = payload;

    const createdTenantAndUser = await this.prismaService.$transaction(
      async (transactionClient: Prisma.TransactionClient) => {
        const createdTenant = await this.tenantRepository.create(
          {
            ...tenant,
          },
          transactionClient,
        );

        const createdUser = await this.userRepository.create(
          {
            ...user,
            tenant: {
              connect: {
                id: createdTenant.id,
              },
            },
          },
          transactionClient,
        );

        await this.tenantRepository.setOwner(
          {
            id: createdTenant.id,
            ownerId: createdUser.id,
          },
          transactionClient,
        );

        return {
          tenant: createdTenant,
          user: createdUser,
        };
      },
    );

    return createdTenantAndUser;
  }

  public async update(payload: UpdateTenantPayload) {
    const { id, ...updatePayload } = payload;
    const updatedTenant = await this.prismaService.$transaction(
      async (transactionClient: Prisma.TransactionClient) => {
        const tenant = await this.tenantRepository.update(
          {
            where: {
              id,
            },
            data: {
              ...updatePayload,
            },
            include: {
              users: true,
            },
          },
          transactionClient,
        );

        const users = await this.userRepository.findAll({
          where: { tenantId: id },
          include: {
            tenant: true,
          },
        });

        if (users.length < 1) return;

        await this.cacheUseCase.regenerateAndCacheAccessTokens(users);

        return tenant;
      },
    );

    return updatedTenant;
  }

  public async incrementProjectsCount(
    payload: IncrementTenantProjectsCountPayload,
  ) {
    const { id } = payload;

    return this.tenantRepository.incrementProjectCount({
      id,
    });
  }

  public async decrementProjectsCount(
    payload: DecrementTenantProjectsCountPayload,
  ) {
    const { id } = payload;

    return this.tenantRepository.decrementProjectCount({
      id,
    });
  }

  public async delete(
    payload: DeleteTenantPayload,
  ): Promise<GetTenantResponse> {
    const { id } = payload;

    const deletedTenant = await this.prismaService.$transaction(
      async (transactionClient: Prisma.TransactionClient) => {
        const tenant = await this.tenantRepository.delete(
          {
            where: {
              id,
            },
            include: {
              users: true,
            },
          },
          transactionClient,
        );

        const { users } = tenant;

        if (!users) return;

        await Promise.all(
          users.map(async (user) => {
            this.cacheUseCase.dropUserAccessTokens(user);
          }),
        );

        return tenant;
      },
    );

    return deletedTenant;
  }
}
