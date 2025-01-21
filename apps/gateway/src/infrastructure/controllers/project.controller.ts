import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import {
  CmsGrpcClient,
  OrchestratorGrpcClient,
  PagingRequestDto,
} from '../../application';
import { User, UserType } from '@prisma/client';
import { AuthorizedUser } from '../middlewares';
import {
  AddClientsToProjectRequestDto,
  AddClientToProjectResponseDto,
  DeleteProjectRequestDto,
  DeleteProjectResponseDto,
  GetProjectRequestDto,
  GetProjectResponseDto,
  ListProjectRequestDto,
  ListProjectResponseDto,
  RemoveClientToProjectRequestDto,
  RemoveClientToProjectResponseDto,
  UpdateProjectRequestDto,
  UpdateProjectResponseDto,
} from '../../application';
import { AuthorizedUserPayload } from 'libs/interfaces';

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly orchestratorClient: OrchestratorGrpcClient,
    private readonly cmsGrpcClient: CmsGrpcClient,
  ) {}

  @Post()
  async create(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Body() dto: ProjectCreateRequestDto,
  ) {}

  @Patch()
  async update(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Body() dto: UpdateProjectRequestDto,
  ): Promise<UpdateProjectResponseDto> {
    return;
  }

  @Get('/retrieve')
  async get(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Query() dto: GetProjectRequestDto,
  ): Promise<GetProjectResponseDto> {
    return;
  }

  @Get('/search')
  async getList(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Query() listQuery: ListProjectRequestDto,
    @Query() pagingQuery: PagingRequestDto,
  ): Promise<ListProjectResponseDto> {
    const { id, type, tenantId } = user;

    if (type === UserType.CLIENT) {
      Object.assign(listQuery.query, { clientUserIds: { has: id } });
    }
  }

  @Post('clients')
  async addClient(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Body() dto: AddClientsToProjectRequestDto,
  ): Promise<AddClientToProjectResponseDto> {
    return;
  }

  @Delete('clients')
  async removeClient(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Body() dto: RemoveClientToProjectRequestDto,
  ): Promise<RemoveClientToProjectResponseDto> {
    return;
  }

  @Delete()
  async delete(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Query() dto: DeleteProjectRequestDto,
  ): Promise<DeleteProjectResponseDto> {
    return;
  }
}
