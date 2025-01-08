import { RpcException } from '@nestjs/microservices';

export class ClientHasBeenAlreadyAddedIntoProjectException extends RpcException {
  code: number;

  name: string;

  constructor() {
    super('Client has been already added into project.');

    this.code = 9;
    this.name = 'ClientHasBeenAlreadyAddedIntoProjectException';
    this.message = 'Client has been already added into project.';
  }
}
