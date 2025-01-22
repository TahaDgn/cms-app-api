import { NestFactory } from '@nestjs/core';
import { IdentityModule } from './identity.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { IDENTITY_SERVICE_GRPC_URL } from 'libs/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    IdentityModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'identity',
        protoPath: join(process.cwd(), '/protos/identity.proto'),
        url: IDENTITY_SERVICE_GRPC_URL,
        loader: {
          enums: String,
          defaults: false,
          // arrays: true,
        },
      },
    },
  );

  await app.listen();

  console.log('Identity microservice is running via gRPC...');
}

bootstrap();
