import { Prisma } from '@prisma/client';

export const TICKET_REPOSITORY = Symbol('TICKET_REPOSITORY');

export interface TicketRepositorySign {
  create(
    payload: Prisma.TicketCreateArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<
    Prisma.TicketGetPayload<{
      include: { ticketComments: true };
    }>
  >;

  findFirst(payload: Prisma.TicketFindFirstArgs): Promise<
    Prisma.TicketGetPayload<{
      include: { ticketComments: true };
    }>
  >;

  findUnique(payload: Prisma.TicketFindUniqueArgs): Promise<
    Prisma.TicketGetPayload<{
      include: { ticketComments: true };
    }>
  >;

  findAll(payload: Prisma.TicketFindManyArgs): Promise<
    Prisma.TicketGetPayload<{
      include: { ticketComments: true };
    }>[]
  >;

  update(
    payload: Prisma.TicketUpdateArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<
    Prisma.TicketGetPayload<{
      include: { ticketComments: true };
    }>
  >;

  delete(
    payload: Prisma.TicketDeleteArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<
    Prisma.TicketGetPayload<{
      include: { ticketComments: true };
    }>
  >;

  count(payload: Prisma.TicketCountArgs): Promise<number>;
}
