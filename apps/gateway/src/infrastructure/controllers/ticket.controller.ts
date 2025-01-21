import { Controller, Post, Body, Patch, Delete } from '@nestjs/common';
import { CmsGrpcClient } from '../../application/grpc-clients';
import { User } from '@prisma/client';
import { AuthorizedUser } from '../middlewares';

@Controller('tickets')
export class TicketController {
  constructor(private readonly cmsGrpcClient: CmsGrpcClient) {}

  @Post()
  async create(@AuthorizedUser() user: AuthorizedUserPayload, @Body() dto) {}

  @Patch(':id')
  async update(@AuthorizedUser() user: AuthorizedUserPayload, @Body() dto) {}

  @Delete(':id')
  async delete(@AuthorizedUser() user: AuthorizedUserPayload, @Body() dto) {}
}
