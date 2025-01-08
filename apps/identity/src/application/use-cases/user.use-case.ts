import { Inject, Injectable } from '@nestjs/common';
import {
  CreateUserPayload,
  DeleteUserPayload,
  ListUsersPayload,
  ListUsersResponse,
} from 'libs/interfaces';
import {
  PRISMA_SERVICE,
  PrismaServiceSign,
  TENANT_REPOSITORY,
  TenantRepositorySign,
  USER_REPOSITORY,
  UserRepositorySign,
} from '../../domain';
import { Prisma, UserType } from '@prisma/client';
import { CacheUseCase } from './cache.use-case';

@Injectable()
export class UserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositorySign,
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: TenantRepositorySign,
    @Inject(PRISMA_SERVICE)
    private readonly prismaService: PrismaServiceSign,
    private readonly cacheUseCase: CacheUseCase,
  ) {}

  public async create(payload: CreateUserPayload) {
    const { tenantId, type, ...restOfUserPayload } = payload;

    const createdUser = await this.prismaService.$transaction(
      async (transactionClient: Prisma.TransactionClient) => {
        const user = await this.userRepository.create(
          {
            ...restOfUserPayload,
            type,
            tenant: {
              connect: { id: tenantId },
            },
          },
          transactionClient,
        );

        if (type === UserType.CLIENT) {
          await this.tenantRepository.incrementClientCount(
            { id: tenantId },
            transactionClient,
          );
        }

        if (type === UserType.PARTICIPANT) {
          await this.tenantRepository.incrementParticipantCount(
            { id: tenantId },
            transactionClient,
          );
        }

        return user;
      },
    );

    return createdUser;
  }

  public async list(payload: ListUsersPayload): Promise<ListUsersResponse> {
    const { tenantId } = payload;

    const users = await this.userRepository.findAll({
      where: {
        tenantId,
      },
      include: {
        tenant: true,
      },
    });

    return { users };
  }

  public async delete(payload: DeleteUserPayload) {
    const { id, tenantId } = payload;

    const deletedUser = await this.prismaService.$transaction(
      async (transactionClient: Prisma.TransactionClient) => {
        const user = await this.userRepository.delete(
          {
            id,
            tenantId,
          },
          transactionClient,
        );

        const { type } = deletedUser;

        if (type === UserType.CLIENT) {
          await this.tenantRepository.decrementClientCount(
            { id: tenantId },
            transactionClient,
          );
        }

        if (type === UserType.PARTICIPANT) {
          await this.tenantRepository.decrementParticipantCount(
            { id: tenantId },
            transactionClient,
          );
        }

        await this.cacheUseCase.dropUserAccessTokens({
          id,
          tenantId,
        });

        return user;
      },
    );

    return deletedUser;
  }
}
