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

  findFirst(
    payload: Prisma.TicketFindFirstArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Ticket>;

  findUnique(
    payload: Prisma.TicketFindUniqueArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Ticket>;

  findAll(
    payload: Prisma.TicketFindManyArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Ticket[]>;

  update(payload: Prisma.TicketUpdateArgs): Promise<Ticket>;

  delete(
    payload: Pick<Prisma.TicketWhereInput, 'id' | 'tenantId'>,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<Ticket>;
}
