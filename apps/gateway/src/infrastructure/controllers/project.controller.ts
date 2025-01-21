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
  CreateProjectRequestDto,
  CreateProjectResponseDto,
  GetProjectQueryDto,
  GetProjectResponseDto,
  ListProjectsResponseDto,
  ListProjectsQueryDto,
  OrchestratorGrpcClient,
  PagingRequestDto,
  UpdateProjectRequestDto,
  UpdateProjectResponseDto,
  createPagingResponse,
  AddClientsToProjectRequestDto,
  AddClientToProjectResponseDto,
  RemoveClientsFromProjectResponseDto,
  RemoveClientsFromProjectRequestDto,
  DeleteProjectResponseDto,
  DeleteProjectQueryDto,
} from '../../application';
import { AuthorizedUser } from '../middlewares';
import {} from '../../application';
import { AuthorizedUserPayload } from 'libs/interfaces';
import { Metadata } from '@grpc/grpc-js';

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly orchestratorClient: OrchestratorGrpcClient,
    private readonly cmsGrpcClient: CmsGrpcClient,
  ) {}

  @Post()
  async create(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Body() createDto: CreateProjectRequestDto,
  ): Promise<CreateProjectResponseDto> {
    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    const { createPayload } = createDto;

    const data = await this.orchestratorClient.createProjectSaga(
      createPayload,
      metadata,
    );

    return {
      success: true,
      data,
    };
  }

  @Patch()
  async update(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Body() updateDto: UpdateProjectRequestDto,
  ): Promise<UpdateProjectResponseDto> {
    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    const { id, updatePayload } = updateDto;

    const data = await this.cmsGrpcClient.updateProject(
      {
        id,
        ...updatePayload,
      },
      metadata,
    );

    return {
      success: true,
      data,
    };
  }

  @Get('retrieve')
  async get(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Query() queryDto: GetProjectQueryDto,
  ): Promise<GetProjectResponseDto> {
    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    const { query } = queryDto;

    const data = await this.cmsGrpcClient.getProject(
      {
        where: query,
      },
      metadata,
    );

    return {
      success: true,
      data,
    };
  }

  @Get('search')
  async list(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Query() listQuery: ListProjectsQueryDto,
    @Query() pagingQuery: PagingRequestDto,
  ): Promise<ListProjectsResponseDto> {
    const { limit, page } = pagingQuery;

    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    const { query } = listQuery;

    const { totalItemsCount, projects: data } =
      await this.cmsGrpcClient.listProjects(
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

  @Post('clients')
  async addClient(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Body() updateDto: AddClientsToProjectRequestDto,
  ): Promise<AddClientToProjectResponseDto> {
    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    const {
      id,
      updatePayload: { clientUserIds },
    } = updateDto;

    const data = await this.orchestratorClient.addClientsToProjectsSaga(
      {
        ids: [id],
        clientUserIds,
      },
      metadata,
    );

    return {
      success: true,
      data,
    };
  }

  @Delete('clients')
  async removeClient(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Body() updateDto: RemoveClientsFromProjectRequestDto,
  ): Promise<RemoveClientsFromProjectResponseDto> {
    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    const {
      id,
      updatePayload: { clientUserIds },
    } = updateDto;

    const data = await this.orchestratorClient.removeClientsFromProjectsSaga(
      {
        ids: [id],
        clientUserIds,
      },
      metadata,
    );

    return {
      success: true,
      data,
    };
  }

  @Delete()
  async delete(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Query() deleteDto: DeleteProjectQueryDto,
  ): Promise<DeleteProjectResponseDto> {
    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    const { id } = deleteDto;

    const data = await this.orchestratorClient.deleteProjectSaga(
      {
        id,
      },
      metadata,
    );

    return {
      success: true,
      data,
    };
  }
}
