import { Prisma, Ticket } from '@prisma/client';

export const TICKET_REPOSITORY = Symbol('TICKET_REPOSITORY');

export interface TicketRepositorySign {
  create(
    payload: Pick<
      Prisma.TicketCreateInput,
      'description' | 'project' | 'tenantId'
    >,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Ticket>;

  findFirst(payload: Prisma.TicketWhereInput): Promise<Ticket>;

  findUnique(payload: Prisma.TicketWhereUniqueInput): Promise<Ticket>;

  findAll(payload: Prisma.TicketWhereInput): Promise<Ticket[]>;

  update(
    id: number,
    payload: Prisma.TicketUpdateInput,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Ticket>;

  delete(
    payload: Pick<Prisma.TicketWhereInput, 'id' | 'tenantId'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Ticket>;
}
