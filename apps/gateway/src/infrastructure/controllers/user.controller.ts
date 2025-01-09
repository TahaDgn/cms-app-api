import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OrchestratorGrpcClient, IdentityGrpcClient } from '../grpc-clients';
import { AuthGuard, AuthorizedUser } from '../middlewares/auth.guard';
import {
  CreateParticipantRequestDto,
  CreateParticipantResponseDto,
  DeleteUserResponseDto,
  GetUserResponsePayload,
  MeResponseDto,
} from '../../application';
import { Prisma, User, UserType } from '@prisma/client';

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
    @AuthorizedUser() user: User,
  ): Promise<CreateParticipantResponseDto> {
    const {
      createPayload: { email, name },
    } = dto;
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

  @AuthGuard([UserType.PARTICIPANT, UserType.CLIENT])
  @Get('me')
  async me(
    @AuthorizedUser() dto: Prisma.UserGetPayload<{ include: { tenant: true } }>,
  ): Promise<MeResponseDto> {
    return {
      success: true,
      data: dto,
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
  @Delete(':id')
  async deleteUser(
    @AuthorizedUser()
    user: Prisma.UserGetPayload<{ include: { tenant: true } }>,
    @Param('id') id: string,
  ): Promise<DeleteUserResponseDto> {
    const { tenantId } = user;

    if (!id) {
      throw new UnprocessableEntityException('Id not be empty');
    }

    const deletedUser = await this.orchestratorClient.userDeletionSaga({
      id: parseInt(id, 10),
      tenantId,
    });

    return {
      success: true,
      data: deletedUser,
    };
  }
}
