import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Ticket } from '@prisma/client';
import { PRISMA_SERVICE, TicketRepositorySign } from '../../domain';

@Injectable()
export class TicketRepository implements TicketRepositorySign {
  constructor(@Inject(PRISMA_SERVICE) private prismaService: PrismaService) {}

  async create(
    payload: Pick<
      Prisma.TicketCreateInput,
      'description' | 'project' | 'tenantId'
    >,
    transactionClient = this.prismaService,
  ): Promise<Ticket> {
    return transactionClient.ticket.create({
      data: {
        ...payload,
      },
    });
  }

  async findFirst(payload: Prisma.TicketWhereInput): Promise<Ticket> {
    return this.prismaService.ticket.findFirst({
      where: {
        ...payload,
      },
    });
  }

  async findUnique(payload: Prisma.TicketWhereUniqueInput): Promise<Ticket> {
    return this.prismaService.ticket.findUnique({
      where: {
        ...payload,
      },
    });
  }

  async findAll(payload: Prisma.TicketWhereInput): Promise<Ticket[]> {
    return this.prismaService.ticket.findMany({
      where: {
        ...payload,
      },
    });
  }

  async update(
    id: number,
    payload: Prisma.TicketUpdateInput,
    transactionClient = this.prismaService,
  ): Promise<Ticket> {
    return transactionClient.ticket.update({
      where: {
        id,
      },
      data: {
        ...payload,
      },
    });
  }

  async delete(
    payload: Pick<Prisma.TicketWhereInput, 'id' | 'tenantId'>,
    transactionClient = this.prismaService,
  ): Promise<Ticket> {
    const ticket = await transactionClient.ticket.findFirst({
      where: {
        ...payload,
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
