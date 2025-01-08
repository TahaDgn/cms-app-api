import { RpcException } from '@nestjs/microservices';

export class ProjectNotFoundException extends RpcException {
  code: number;

  name: string;

  constructor() {
    super('Project not found.');

    this.code = 9;
    this.name = 'ProjectNotFoundException';
    this.message = 'Project not found.';
  }
}
