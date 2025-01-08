// apps/notification/src/infrastructure/rabbitmq/notification.listener.ts
import { OnModuleInit, Injectable } from '@nestjs/common';
import { RabbitMQAdapter } from 'libs/adapters';
import { NOTIFICATION_QUEUE } from 'libs/constants';
import { NotificationMessage } from 'libs/interfaces';
import { MailService } from '../mail/mail.service';

@Injectable()
export class NotificationListener implements OnModuleInit {
  constructor(
    private readonly rabbitmq: RabbitMQAdapter,
    private readonly mailService: MailService,
  ) {}

  async onModuleInit() {
    // Kuyruğa abone ol
    await this.rabbitmq.subscribe(
      NOTIFICATION_QUEUE,
      (msg: NotificationMessage) => {
        this.handleNotification(msg);
      },
    );
  }

  private async handleNotification(msg: NotificationMessage) {
    switch (msg.type) {
      case 'REGISTRATION_LINK':
        // Genelde "welcome" e-postası
        await this.mailService.sendWelcomeEmail(
          msg.email,
          msg.payload?.name || 'New User',
          msg.payload?.accessUrl || '#',
        );
        break;

      case 'LOGIN_LINK':
        // "login" e-postası
        await this.mailService.sendLoginEmail(
          msg.email,
          msg.payload?.name || 'User',
          msg.payload?.accessUrl || '#',
        );
        break;

      case 'USER_DELETED':
        // "user-deleted" e-postası
        await this.mailService.sendUserDeletedEmail(
          msg.email,
          msg.payload?.name || 'User',
          msg.payload?.userType || 'PARTICIPANT',
        );
        break;

      default:
        console.log('Unknown notification type:', msg.type);
    }
  }
}
