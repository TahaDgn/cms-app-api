import { NestFactory } from '@nestjs/core';
import { OrchestratorModule } from './orchestrator.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrchestratorModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'orchestrator',
        protoPath: join(__dirname, 'orchestrator.proto'),
        url: 'localhost:50001',
      },
    },
  );
  await app.listen();
  console.log('Orchestrator (Saga) microservice is running via gRPC...');
}
bootstrap();
