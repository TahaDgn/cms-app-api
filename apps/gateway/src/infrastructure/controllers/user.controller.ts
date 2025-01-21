import { Controller, Post, Body, Get, Delete, Query } from '@nestjs/common';
import {
  OrchestratorGrpcClient,
  IdentityGrpcClient,
  ListUsersRequestDto,
  ListUsersResponseDto,
  PagingRequestDto,
  createPagingResponse,
  DeleteUserQueryDto,
  CreateUserResponseDto,
} from '../../application';
import { AuthGuard, AuthorizedUser } from '../middlewares/auth.guard';
import {
  CreateUserRequestDto,
  DeleteUserResponseDto,
  MeResponseDto,
} from '../../application';
import { UserType } from '@prisma/client';
import { AuthorizedUserPayload } from 'libs/interfaces';

@Controller('users')
export class UserController {
  constructor(
    private readonly orchestratorClient: OrchestratorGrpcClient,
    private readonly identityClient: IdentityGrpcClient,
  ) {}

  @AuthGuard(UserType.PARTICIPANT)
  @Post()
  async create(
    @Body() createDto: CreateUserRequestDto,
    @AuthorizedUser() user: AuthorizedUserPayload,
  ): Promise<CreateUserResponseDto> {
    const {
      createPayload: { email, name, type },
    } = createDto;
    const { tenantId } = user;

    const data = await this.orchestratorClient.userCreationSaga({
      email,
      name,
      tenantId,
      type,
    });

    return {
      success: true,
      data,
    };
  }

  @AuthGuard('*')
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

  @AuthGuard('*')
  @Get('search')
  async listUsers(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Query() listQuery: ListUsersRequestDto,
    @Query() pagingQuery: PagingRequestDto,
  ): Promise<ListUsersResponseDto> {
    const { tenantId } = user;

    const { totalItemsCount, users: data } =
      await this.identityClient.listUsers({
        where: {
          tenantId,
          ...listQuery,
        },
      });

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

  @AuthGuard(UserType.PARTICIPANT)
  @Delete()
  async deleteUser(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Query() deleteQuery: DeleteUserQueryDto,
  ): Promise<DeleteUserResponseDto> {
    const { tenantId } = user;

    const data = await this.orchestratorClient.userDeletionSaga({
      tenantId,
      ...deleteQuery,
    });

    return {
      success: true,
      data,
    };
  }
}
