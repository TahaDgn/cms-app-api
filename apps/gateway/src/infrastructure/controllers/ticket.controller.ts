import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { CmsGrpcClient } from '../../application/grpc-clients';
import { AuthGuardRequired, AuthorizedUser } from '../middlewares';
import {
  CreateTicketRequestDto,
  CreateTicketResponseDto,
  DeleteTicketQueryDto,
  DeleteTicketResponseDto,
  GetTicketListQueryDto,
  ListTicketsResponseDto,
  GetTicketQueryDto,
  GetTicketResponseDto,
  UpdateTicketRequestDto,
  UpdateTicketResponseDto,
  PagingRequestDto,
  createPagingResponse,
} from '../../application';
import { AuthorizedUserPayload } from 'libs/interfaces/gateway.interface';
import { Metadata } from '@grpc/grpc-js';
import { UserType } from '@prisma/client';

@Controller('tickets')
export class TicketController {
  constructor(private readonly cmsGrpcClient: CmsGrpcClient) {}

  @AuthGuardRequired(UserType.CLIENT)
  @Post()
  async create(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Body() createDto: CreateTicketRequestDto,
  ): Promise<CreateTicketResponseDto> {
    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    const { createPayload } = createDto;

    const data = await this.cmsGrpcClient.createTicket(createPayload, metadata);

    return {
      success: true,
      data,
    };
  }

  @AuthGuardRequired('*')
  @Get('retrieve')
  async get(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Body() queryDto: GetTicketQueryDto,
  ): Promise<GetTicketResponseDto> {
    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    const { query } = queryDto;

    const data = await this.cmsGrpcClient.getTicket(
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

  @AuthGuardRequired('*')
  @Get('search')
  async list(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Query() listQuery: GetTicketListQueryDto,
    @Query() pagingQuery: PagingRequestDto,
  ): Promise<ListTicketsResponseDto> {
    const { limit, page } = pagingQuery;

    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    const { query } = listQuery;

    const { totalItemsCount, tickets: data } =
      await this.cmsGrpcClient.listTickets(
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
  @Patch()
  async update(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Body() updateDto: UpdateTicketRequestDto,
  ): Promise<UpdateTicketResponseDto> {
    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    const { id, updatePayload } = updateDto;

    const data = await this.cmsGrpcClient.updateTicket(
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

  @AuthGuardRequired(UserType.PARTICIPANT)
  @Delete()
  async delete(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Body() deleteDto: DeleteTicketQueryDto,
  ): Promise<DeleteTicketResponseDto> {
    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    const { id } = deleteDto;

    const data = await this.cmsGrpcClient.deleteTicket(
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
