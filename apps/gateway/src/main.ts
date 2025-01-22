import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { GATEWAY_HTTP_PORT } from 'libs/constants';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  await app.listen(GATEWAY_HTTP_PORT);

  console.log('Gateway is running on port:', GATEWAY_HTTP_PORT);
}

bootstrap();
