import { RpcException } from '@nestjs/microservices';

export class TicketCommentNotFoundException extends RpcException {
  code: number;

  name: string;

  constructor() {
    super('Ticket comment not found.');

    this.code = 9;
    this.name = 'TicketCommentNotFoundException';
    this.message = 'Ticket comment not found.';
  }
}
