import { Controller, Post, Body, Get, Delete, Query } from '@nestjs/common';
import {
  OrchestratorGrpcClient,
  IdentityGrpcClient,
  ListUsersQueryDto,
  ListUsersResponseDto,
  PagingRequestDto,
  createPagingResponse,
  DeleteUserQueryDto,
  CreateUserResponseDto,
  GetUserQueryDto,
} from '../../application';
import { AuthGuardRequired, AuthorizedUser } from '../middlewares/auth.guard';
import {
  CreateUserRequestDto,
  DeleteUserResponseDto,
  MeResponseDto,
} from '../../application';
import { UserType } from '@prisma/client';
import { AuthorizedUserPayload } from 'libs/interfaces';
import { Metadata } from '@grpc/grpc-js';

@Controller('users')
export class UserController {
  constructor(
    private readonly orchestratorClient: OrchestratorGrpcClient,
    private readonly identityClient: IdentityGrpcClient,
  ) {}

  @AuthGuardRequired(UserType.PARTICIPANT)
  @Post()
  async create(
    @Body() createDto: CreateUserRequestDto,
    @AuthorizedUser() user: AuthorizedUserPayload,
  ): Promise<CreateUserResponseDto> {
    const { createPayload } = createDto;

    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    const data = await this.orchestratorClient.userCreationSaga(
      createPayload,
      metadata,
    );

    return {
      success: true,
      data,
    };
  }

  @AuthGuardRequired('*')
  @Get('me')
  async me(
    @AuthorizedUser() user: AuthorizedUserPayload,
  ): Promise<MeResponseDto> {
    const data = user;

    return {
      success: true,
      data,
    };
  }

  @AuthGuardRequired('*')
  @Get('retrieve')
  async get(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Query() getQuery: GetUserQueryDto,
  ) {
    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    const { query } = getQuery;

    const data = await this.identityClient.getUser({ where: query }, metadata);

    return {
      success: true,
      data,
    };
  }

  @AuthGuardRequired('*')
  @Get('search')
  async list(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Query() listQuery: ListUsersQueryDto,
    @Query() pagingQuery: PagingRequestDto,
  ): Promise<ListUsersResponseDto> {
    const { limit, page } = pagingQuery;

    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    const { query } = listQuery;

    const { totalItemsCount, users: data } =
      await this.identityClient.listUsers(
        {
          where: query,
          skip: (page - 1) * limit,
          take: limit,
        },
        metadata,
      );

    const pagination = createPagingResponse(
      pagingQuery,
      totalItemsCount,
      data.length,
    );

    return {
      success: true,
      data,
      pagination,
    };
  }

  @AuthGuardRequired(UserType.PARTICIPANT)
  @Delete()
  async deleteUser(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Query() deleteQuery: DeleteUserQueryDto,
  ): Promise<DeleteUserResponseDto> {
    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    const data = await this.orchestratorClient.userDeletionSaga(
      deleteQuery,
      metadata,
    );

    return {
      success: true,
      data,
    };
  }
}
