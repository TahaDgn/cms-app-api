import { RpcException } from '@nestjs/microservices';

export class UserNotFoundException extends RpcException {
  code: number;

  name: string;

  constructor() {
    super('User not found.');

    this.code = 9;
    this.name = 'UserNotFoundException';
    this.message = 'User not found.';
  }
}
