import { Inject, Injectable } from '@nestjs/common';
import {
  CreateUserPayload,
  DeleteUserPayload,
  GetUserPayload,
  ListUserPayload,
  ListUsersResponse,
  GetUserResponse,
} from 'libs/interfaces';
import {
  PRISMA_SERVICE,
  PrismaServiceSign,
  TENANT_REPOSITORY,
  TenantRepositorySign,
  USER_REPOSITORY,
  UserNotFoundException,
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

  public async createUserIfNotExists(payload: CreateUserPayload) {
    const { tenantId, type, name, email } = payload;

    const existingUser = await this.userRepository.findFirst({
      where: {
        tenantId,
        email,
      },
      include: {
        tenant: true,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    const createdUser = await this.prismaService.$transaction(
      async (transactionClient: Prisma.TransactionClient) => {
        const user = await this.userRepository.create(
          {
            email,
            name,
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

  public async list(payload: ListUserPayload): Promise<ListUsersResponse> {
    const users = await this.userRepository.findAll({
      where: {
        ...payload,
      },
    });

    return { users };
  }

  public async getOrFail(
    payload: GetUserPayload,
  ): Promise<GetUserResponse> {
    const { id, tenantId } = payload;

    const user = await this.userRepository.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!user) throw new UserNotFoundException();

    return user;
  }

  public async delete(payload: DeleteUserPayload) {
    const deletedUser = await this.prismaService.$transaction(
      async (transactionClient: Prisma.TransactionClient) => {
        const user = await this.userRepository.delete(
          {
            ...payload,
          },
          transactionClient,
        );

        const { type, tenantId, id } = deletedUser;

        if (type === UserType.CLIENT) {
          await this.tenantRepository.decrementClientCount(
            { id: user.tenantId },
            transactionClient,
          );
        }

        if (type === UserType.PARTICIPANT) {
          await this.tenantRepository.decrementParticipantCount(
            {
              id,
            },
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
