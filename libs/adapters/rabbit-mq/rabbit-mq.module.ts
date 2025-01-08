import { Module, Global } from '@nestjs/common';
import { RabbitMQAdapter } from './rabbit-mq.adapter';

@Global()
@Module({
  providers: [RabbitMQAdapter],
  exports: [RabbitMQAdapter],
})
export class RabbitMQModule {}
