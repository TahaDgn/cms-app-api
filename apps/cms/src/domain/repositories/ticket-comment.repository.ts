import { Prisma } from '@prisma/client';

export const TICKET_COMMENT_REPOSITORY = Symbol('TICKET_COMMENT_REPOSITORY');

export interface TicketCommentRepositorySign {
  create(
    payload: Prisma.TicketCommentCreateArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<
    Prisma.TicketCommentGetPayload<{
      include: { ticket: true };
    }>
  >;

  findFirst(payload: Prisma.TicketCommentFindFirstArgs): Promise<
    Prisma.TicketCommentGetPayload<{
      include: { ticket: true };
    }>
  >;

  delete(
    payload: Prisma.TicketCommentDeleteArgs,
    transactionClient?: Prisma.TransactionClient,
  ): Promise<
    Prisma.TicketCommentGetPayload<{
      include: { ticket: true };
    }>
  >;
}
