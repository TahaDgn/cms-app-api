// apps/identity/src/application/identity.service.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  CreateTenantAndUserPayload,
  CreateTenantAndUserResponse,
  DeleteTenantPayload,
  GetTenantResponse,
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

@Injectable()
export class TenantUseCase {
  constructor(
    @Inject(PRISMA_SERVICE)
    private readonly prismaService: PrismaServiceSign,
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepositorySign,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositorySign,
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
          createdTenant.id,
          {
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

  public async delete(
    payload: DeleteTenantPayload,
  ): Promise<GetTenantResponse> {
    return this.tenantRepository.delete(payload);
  }
}
