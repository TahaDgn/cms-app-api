import { Controller, Post, Body, Delete, Query } from '@nestjs/common';
import { CmsGrpcClient } from '../../application/grpc-clients';
import { AuthGuardRequired, AuthorizedUser } from '../middlewares';
import {
  DeleteTicketQueryDto,
  DeleteTicketResponseDto,
  CreateTicketCommentRequestDto,
  CreateTicketCommentResponseDto,
} from '../../application';
import { AuthorizedUserPayload } from 'libs/interfaces/gateway.interface';
import { Metadata } from '@grpc/grpc-js';
import { UserType } from '@prisma/client';

@Controller('ticket-comments')
export class TicketCommentController {
  constructor(private readonly cmsGrpcClient: CmsGrpcClient) {}

  @AuthGuardRequired('*')
  @Post()
  async create(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Body() createDto: CreateTicketCommentRequestDto,
  ): Promise<CreateTicketCommentResponseDto> {
    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    const { createPayload } = createDto;

    const data = await this.cmsGrpcClient.createTicketComment(
      createPayload,
      metadata,
    );

    return {
      success: true,
      data: data.ticket,
    };
  }

  @AuthGuardRequired(UserType.PARTICIPANT)
  @Delete()
  async delete(
    @AuthorizedUser() user: AuthorizedUserPayload,
    @Query() deleteDto: DeleteTicketQueryDto,
  ): Promise<DeleteTicketResponseDto> {
    const metadata = new Metadata();

    metadata.add('User', JSON.stringify(user));

    const { id } = deleteDto;

    const data = await this.cmsGrpcClient.deleteTicketComment(
      {
        id,
      },
      metadata,
    );

    return {
      success: true,
      data: data.ticket,
    };
  }
}
