import { Inject, Injectable } from '@nestjs/common';
import {
  TICKET_COMMENT_REPOSITORY,
  TICKET_REPOSITORY,
  TicketCommentNotFoundException,
  TicketCommentRepositorySign,
  TicketNotFoundException,
  TicketRepositorySign,
} from '../../domain';
import {
  AuthorizedUserPayload,
  CreateTicketCommentPayload,
  DeleteTicketCommentPayload,
  GetTicketResponse,
} from 'libs/interfaces';
import { Prisma, UserType } from '@prisma/client';

@Injectable()
export class TicketCommentUseCase {
  constructor(
    @Inject(TICKET_COMMENT_REPOSITORY)
    private readonly ticketCommentRepository: TicketCommentRepositorySign,
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepositorySign,
  ) {}

  public async create(
    payload: CreateTicketCommentPayload,
    user: AuthorizedUserPayload,
  ): Promise<GetTicketResponse> {
    const { ticketId, ...restOfPayload } = payload;
    const { tenantId, id: createdBy, type } = user;

    const clientQuery: Pick<Prisma.TicketWhereInput, 'project'> =
      type === UserType.CLIENT
        ? {
            project: {
              clientUserIds: {
                has: createdBy,
              },
            },
          }
        : {
            project: undefined,
          };

    const ticket = await this.ticketRepository.findFirst({
      where: {
        id: ticketId,
        tenantId,
        ...clientQuery,
      },
    });

    if (!ticket) throw new TicketNotFoundException();

    await this.ticketCommentRepository.create({
      data: {
        tenantId,
        createdBy,
        ticket: { connect: { id: ticketId, tenantId } },
        ...restOfPayload,
      },
    });

    return this.ticketRepository.findFirst({
      where: {
        id: ticketId,
        tenantId,
      },
      include: {
        ticketComments: true,
      },
    });
  }

  public async delete(
    payload: DeleteTicketCommentPayload,
    user: AuthorizedUserPayload,
  ): Promise<GetTicketResponse> {
    const { id } = payload;
    const { tenantId, id: createdBy, type } = user;

    const createdByQuery: Pick<Prisma.TicketCommentWhereInput, 'createdBy'> =
      type === UserType.CLIENT
        ? {
            createdBy,
          }
        : {
            createdBy: undefined,
          };

    const ticketComment = await this.ticketCommentRepository.findFirst({
      where: {
        id,
        tenantId,
        ...createdByQuery,
      },
    });

    if (!ticketComment) throw new TicketCommentNotFoundException();

    await this.ticketCommentRepository.delete({
      where: {
        id,
        tenantId,
      },
    });

    return this.ticketRepository.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        ticketComments: true,
      },
    });
  }
}
