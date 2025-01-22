import { NestFactory } from '@nestjs/core';
import { CmsModule } from './cms.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CMS_SERVICE_GRPC_URL } from 'libs/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CmsModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'cms',
        protoPath: join(process.cwd(), '/protos/cms.proto'),
        url: CMS_SERVICE_GRPC_URL,
        loader: {
          enums: String,
          defaults: false,
          // arrays: true,
        },
      },
    },
  );

  await app.listen();

  console.log('Cms microservice is running via gRPC...');
}
bootstrap();
