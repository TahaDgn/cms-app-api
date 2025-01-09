import { Controller, Post, Body, Get, Patch, Delete } from '@nestjs/common';
import { CmsGrpcClient, OrchestratorGrpcClient } from '../grpc-clients';
import { User } from '@prisma/client';
import { AuthorizedUser } from '../guards';

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly orchestratorClient: OrchestratorGrpcClient,
    private readonly cmsGrpcClient: CmsGrpcClient,
  ) {}

  @Post()
  async create(@AuthorizedUser() user: User, @Body() dto) {}

  @Patch(':id')
  async update(@AuthorizedUser() user: User, @Body() dto) {}

  @Delete(':id')
  async delete(@AuthorizedUser() user: User, @Body() dto) {}

  @Get(':id')
  async getById(@AuthorizedUser() user: User, @Body() dto) {}

  @Get()
  async getList(@AuthorizedUser() user: User) {}

  @Get('mine')
  async getListMine(@AuthorizedUser() user: User) {}

  @Post('client')
  async addClient(@AuthorizedUser() user: User, @Body() dto) {}

  @Delete('client')
  async removeClient(@AuthorizedUser() user: User, @Body() dto) {}
}
