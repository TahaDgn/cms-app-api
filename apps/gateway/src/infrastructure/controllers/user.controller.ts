import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { OrchestratorGrpcClient, IdentityGrpcClient } from '../grpc-clients';
import { AuthGuard, AuthorizedUser } from '../guards/auth.guard';
import {
  CreateParticipantRequestDto,
  CreateParticipantResponseDto,
  DeleteUserRequestDto,
  DeleteUserResponseDto,
} from '../../application';
import { Prisma, UserType } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(
    private readonly orchestratorClient: OrchestratorGrpcClient,
    private readonly identityClient: IdentityGrpcClient,
  ) {}

  @AuthGuard([UserType.PARTICIPANT])
  @Post('participant')
  async createParticipant(
    @Body() dto: CreateParticipantRequestDto,
    @AuthorizedUser()
    user: Prisma.UserGetPayload<{ include: { tenant: true } }>,
  ): Promise<CreateParticipantResponseDto> {
    const { email, name } = dto;
    const { tenantId } = user;

    const createdParticipant = await this.orchestratorClient.userCreationSaga({
      email,
      name,
      tenantId,
      type: UserType.PARTICIPANT,
    });

    return {
      success: true,
      data: createdParticipant,
    };
  }

  @AuthGuard([UserType.PARTICIPANT])
  @Get()
  async listUsers(
    @AuthorizedUser()
    user: Prisma.UserGetPayload<{ include: { tenant: true } }>,
  ) {
    const { tenantId } = user;

    const { users } = await this.identityClient.listTenantUsers({
      tenantId,
    });

    return users;
  }

  @AuthGuard([UserType.PARTICIPANT])
  @Delete()
  async deleteUser(
    @Body() dto: DeleteUserRequestDto,
    @AuthorizedUser()
    user: Prisma.UserGetPayload<{ include: { tenant: true } }>,
  ): Promise<DeleteUserResponseDto> {
    const { tenantId } = user;
    const { id } = dto;

    const deletedUser = await this.orchestratorClient.userDeletionSaga({
      id,
      tenantId,
    });

    return {
      success: true,
      data: deletedUser,
    };
  }
}
