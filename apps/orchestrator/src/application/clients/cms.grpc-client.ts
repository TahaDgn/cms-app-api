import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { CmsService } from 'libs/interfaces';
import { join } from 'path';

@Injectable()
export class CmsGrpcClient implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'cms',
      protoPath: join(__dirname, 'cms.proto'),
    },
  })
  private client: ClientGrpc;

  private cmsService: CmsService;

  onModuleInit() {
    this.cmsService = this.client.getService<CmsService>('CmsService');
  }
}
