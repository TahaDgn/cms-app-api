import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { OrchestratorClient, IdentityClient } from '../grpc-clients';
import { AuthGuard, AuthorizedUser } from '../guards/auth.guard';
import {
  CreateParticipantRequestDto,
  CreateParticipantResponseDto,
  DeleteUserRequestDto,
  DeleteUserResponseDto,
} from '../../application/dtos';
import { User, UserType } from '@prisma/client';

@Controller('users')
export class AuthController {
  constructor(
    private readonly orchestratorClient: OrchestratorClient,
    private readonly identityClient: IdentityClient,
  ) {}

  @AuthGuard(UserType.PARTICIPANT)
  @Post()
  async createParticipant(
    @Body() dto: CreateParticipantRequestDto,
    @AuthorizedUser() user: User,
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

  @AuthGuard(UserType.PARTICIPANT)
  @Get()
  async listUsers(@AuthorizedUser() user: User) {
    const { tenantId } = user;

    const resp = await this.identityClient.listTenantUsers({
      tenantId,
    });
    return resp.users;
  }

  @AuthGuard(UserType.PARTICIPANT)
  @Delete()
  async deleteUser(
    @Body() dto: DeleteUserRequestDto,
    @AuthorizedUser() user: User,
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
