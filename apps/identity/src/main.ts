import { NestFactory } from '@nestjs/core';
import { IdentityModule } from './identity.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    IdentityModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'identity',
        protoPath: join(__dirname, './infrastructure/grpc/identity.proto'),
        url: 'localhost:50001',
      },
    },
  );

  await app.listen();
  console.log('Identity microservice is running via gRPC...');
}
bootstrap();
