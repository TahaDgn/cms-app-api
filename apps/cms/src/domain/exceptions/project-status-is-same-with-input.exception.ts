import { RpcException } from '@nestjs/microservices';

export class ProjectStatusIsSameWithInputException extends RpcException {
  code: number;

  name: string;

  constructor() {
    super('Project status is same with input.');

    this.code = 9;
    this.name = 'ProjectStatusIsSameWithInput';
    this.message = 'Project status is same with input.';
  }
}
