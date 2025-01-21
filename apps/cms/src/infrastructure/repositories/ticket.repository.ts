import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PRISMA_SERVICE, TicketRepositorySign } from '../../domain';

@Injectable()
export class TicketRepository implements TicketRepositorySign {
  constructor(@Inject(PRISMA_SERVICE) private prismaService: PrismaService) {}

  async create(
    payload: Prisma.TicketCreateArgs,
    transactionClient = this.prismaService,
  ): Promise<
    Prisma.TicketGetPayload<{
      include: { ticketComments: true };
    }>
  > {
    return <
      Prisma.TicketGetPayload<{
        include: { ticketComments: true };
      }>
    >(<unknown>transactionClient.ticket.create(payload));
  }

  async findFirst(payload: Prisma.TicketFindFirstArgs): Promise<
    Prisma.TicketGetPayload<{
      include: { ticketComments: true };
    }>
  > {
    return <
      Prisma.TicketGetPayload<{
        include: { ticketComments: true };
      }>
    >(<unknown>this.prismaService.ticket.findFirst(payload));
  }

  async findUnique(payload: Prisma.TicketFindUniqueArgs): Promise<
    Prisma.TicketGetPayload<{
      include: { ticketComments: true };
    }>
  > {
    return <
      Prisma.TicketGetPayload<{
        include: { ticketComments: true };
      }>
    >(<unknown>this.prismaService.ticket.findUnique(payload));
  }

  async findAll(payload: Prisma.TicketFindManyArgs): Promise<
    Prisma.TicketGetPayload<{
      include: { ticketComments: true };
    }>[]
  > {
    return <
      Prisma.TicketGetPayload<{
        include: { ticketComments: true };
      }>[]
    >(<unknown>this.prismaService.ticket.findMany(payload));
  }

  async update(
    payload: Prisma.TicketUpdateArgs,
    transactionClient = this.prismaService,
  ): Promise<
    Prisma.TicketGetPayload<{
      include: { ticketComments: true };
    }>
  > {
    return <
      Prisma.TicketGetPayload<{
        include: { ticketComments: true };
      }>
    >(<unknown>transactionClient.ticket.update(payload));
  }

  async count(payload: Prisma.TicketCountArgs): Promise<number> {
    return this.prismaService.ticket.count(payload);
  }

  async delete(
    payload: Prisma.TicketDeleteArgs,
    transactionClient = this.prismaService,
  ): Promise<
    Prisma.TicketGetPayload<{
      include: { ticketComments: true };
    }>
  > {
    const { where } = payload;

    const ticket = <
      Prisma.TicketGetPayload<{
        include: { ticketComments: true };
      }>
    >await transactionClient.ticket.findFirst({
      where,
      include: {
        ticketComments: true,
      },
    });

    if (!ticket) return;

    const { id } = ticket;

    await transactionClient.ticket.delete({
      where: {
        id,
      },
    });

    return ticket;
  }
}
