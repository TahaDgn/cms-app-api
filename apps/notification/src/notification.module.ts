// apps/notification/src/notification.module.ts
import { Module } from '@nestjs/common';
import { RabbitMQModule } from 'libs/adapters';
import { NotificationListener } from './infrastructure/rabbit-mq/notification.listener';
import { MailService } from './infrastructure/mail/mail.service';

@Module({
  imports: [RabbitMQModule],
  providers: [NotificationListener, MailService],
})
export class NotificationModule {}
