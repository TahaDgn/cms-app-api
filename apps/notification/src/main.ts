// apps/notification/src/main.ts
import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);

  app.listen(3000); // Bypass Nest

  console.log('Notification service is running');
}

bootstrap();
