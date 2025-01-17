import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CmsGrpcClient, OrchestratorGrpcClient, PagingRequestDto } from '../../application';
import { User } from '@prisma/client';
import { AuthorizedUser } from '../middlewares';
import {
  AddClientToProjectRequestDto,
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

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly orchestratorClient: OrchestratorGrpcClient,
    private readonly cmsGrpcClient: CmsGrpcClient,
  ) {}

  @Post()
  async create(
    @AuthorizedUser() user: User,
    @Body() dto: ProjectCreateRequestDto,
  ) {}

  @Patch()
  async update(
    @AuthorizedUser() user: User,
    @Body() dto: UpdateProjectRequestDto,
  ): Promise<UpdateProjectResponseDto> {
    return;
  }

  @Get('/retrieve')
  async get(
    @AuthorizedUser() user: User,
    @Query() dto: GetProjectRequestDto,
  ): Promise<GetProjectResponseDto> {
    return;
  }

  @Get()
  async getList(
    @AuthorizedUser() user: User,
    @Query() dto: ListProjectRequestDto,
    @Query() paging: PagingRequestDto,
  ): Promise<ListProjectResponseDto> {
    return;
  }

  @Post('clients')
  async addClient(
    @AuthorizedUser() user: User,
    @Body() dto: AddClientToProjectRequestDto,
  ): Promise<AddClientToProjectResponseDto> {
    return;
  }

  @Delete('clients')
  async removeClient(
    @AuthorizedUser() user: User,
    @Body() dto: RemoveClientToProjectRequestDto,
  ): Promise<RemoveClientToProjectResponseDto> {
    return;
  }

  @Delete()
  async delete(
    @AuthorizedUser() user: User,
    @Query() dto: DeleteProjectRequestDto,
  ): Promise<DeleteProjectResponseDto> {
    return;
  }
}
