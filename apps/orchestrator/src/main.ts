import { NestFactory } from '@nestjs/core';
import { OrchestratorModule } from './orchestrator.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ORCHESTRATOR_SERVICE_GRPC_URL } from 'libs/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrchestratorModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'orchestrator',
        protoPath: join(process.cwd(), '/protos/orchestrator.proto'),
        url: ORCHESTRATOR_SERVICE_GRPC_URL,
        loader: {
          enums: String,
          defaults: false,
          // arrays: true,
        },
      },
    },
  );
  await app.listen();

  console.log('Orchestrator (Saga) microservice is running via gRPC...');
}

bootstrap();
