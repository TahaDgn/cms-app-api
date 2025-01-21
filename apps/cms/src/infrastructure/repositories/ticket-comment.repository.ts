import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PRISMA_SERVICE, TicketCommentRepositorySign } from '../../domain';

@Injectable()
export class TicketCommentRepository implements TicketCommentRepositorySign {
  constructor(@Inject(PRISMA_SERVICE) private prismaService: PrismaService) {}

  async create(
    payload: Prisma.TicketCommentCreateArgs,
    transactionClient = this.prismaService,
  ): Promise<
    Prisma.TicketCommentGetPayload<{
      include: { ticket: true };
    }>
  > {
    return <
      Prisma.TicketCommentGetPayload<{
        include: { ticket: true };
      }>
    >(<unknown>transactionClient.ticketComment.create(payload));
  }

  async findFirst(payload: Prisma.TicketCommentFindFirstArgs): Promise<
    Prisma.TicketCommentGetPayload<{
      include: { ticket: true };
    }>
  > {
    return <
      Prisma.TicketCommentGetPayload<{
        include: { ticket: true };
      }>
    >(<unknown>this.prismaService.ticketComment.findFirst(payload));
  }

  async delete(
    payload: Prisma.TicketCommentDeleteArgs,
    transactionClient = this.prismaService,
  ): Promise<
    Prisma.TicketCommentGetPayload<{
      include: { ticket: true };
    }>
  > {
    const { where } = payload;

    const ticketComment = <
      Prisma.TicketCommentGetPayload<{
        include: { ticket: true };
      }>
    >await transactionClient.ticketComment.findFirst({
      where,
      include: {
        ticket: true,
      },
    });

    if (!ticketComment) return;

    const { id } = ticketComment;

    await transactionClient.ticketComment.delete({
      where: {
        id,
      },
    });

    return ticketComment;
  }
}
