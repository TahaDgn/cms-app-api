import { RpcException } from '@nestjs/microservices';

export class TicketNotFoundException extends RpcException {
  code: number;

  name: string;

  constructor() {
    super('Ticket not found.');

    this.code = 9;
    this.name = 'TicketNotFoundException';
    this.message = 'Ticket not found.';
  }
}
