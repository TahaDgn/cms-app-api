import { Inject, Injectable } from '@nestjs/common';
import {
  AuthorizedUserPayload,
  CreateUserPayload,
  DeleteUserPayload,
  GetUserPayload,
  GetUserResponse,
  ListUserPayload,
  ListUsersResponse,
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

  public async create(payload: CreateUserPayload, user: AuthorizedUserPayload) {
    const { tenantId } = user;

    const { type, name, email } = payload;

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
            data: {
              email,
              name,
              type,
              tenant: {
                connect: { id: tenantId },
              },
            },
            include: {
              tenant: true,
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

  public async list(
    payload: ListUserPayload,
    user: AuthorizedUserPayload,
  ): Promise<ListUsersResponse> {
    const { where, skip, take } = payload;
    const { tenantId } = user;

    const users = await this.userRepository.findAll({
      where: {
        ...where,
        tenantId,
      },
      skip,
      take,
    });

    const totalItemsCount = await this.userRepository.count({
      where,
    });

    return {
      users,
      totalItemsCount,
    };
  }

  public async get(
    payload: GetUserPayload,
    user: AuthorizedUserPayload,
  ): Promise<GetUserResponse> {
    const { tenantId } = user;

    const { where } = payload;

    const result = await this.userRepository.findFirst({
      where: {
        ...where,
        tenantId,
      },
    });

    return {
      user: result,
    };
  }

  public async getOrFail(
    payload: GetUserPayload,
    user: AuthorizedUserPayload,
  ): Promise<GetUserResponse> {
    const { tenantId } = user;

    const { where } = payload;

    const result = await this.userRepository.findFirst({
      where: {
        ...where,
        tenantId,
      },
    });

    if (!result) throw new UserNotFoundException();

    return {
      user: result,
    };
  }

  public async delete(
    payload: DeleteUserPayload,
    authorizedUser: AuthorizedUserPayload,
  ) {
    const { id } = payload;

    const { tenantId } = authorizedUser;

    const deletedUser = await this.prismaService.$transaction(
      async (transactionClient: Prisma.TransactionClient) => {
        const user = await this.userRepository.findUnique({
          where: {
            id,
            tenantId,
          },
          include: {
            tenant: true,
          },
        });

        if (!user) {
          throw new UserNotFoundException();
        }

        await this.userRepository.delete(
          {
            where: { id: user.id, tenantId: user.tenantId },
            include: {
              tenant: true,
            },
          },
          transactionClient,
        );

        const { type } = user;

        if (type === UserType.CLIENT) {
          await this.tenantRepository.decrementClientCount(
            { id: user.tenantId },
            transactionClient,
          );
        }

        if (type === UserType.PARTICIPANT) {
          await this.tenantRepository.decrementParticipantCount(
            {
              id: user.tenantId,
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
