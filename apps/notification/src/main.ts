// apps/notification/src/main.ts
import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';

async function bootstrap() {
  await NestFactory.create(NotificationModule);

  console.log('Notification service is running');
}
bootstrap();
