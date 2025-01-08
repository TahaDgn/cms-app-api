import { RpcException } from '@nestjs/microservices';

export class AccessCodeInvalidException extends RpcException {
  code: number;

  name: string;

  constructor() {
    super('Access code invalid.');

    this.code = 9;
    this.name = 'AccessCodeInvalidException';
    this.message = 'Access code invalid.';
  }
}
