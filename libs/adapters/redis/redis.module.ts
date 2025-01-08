import { Module, Global } from '@nestjs/common';
import { RedisAdapter } from './redis.adapter';

@Global()
@Module({
  providers: [RedisAdapter],
  exports: [RedisAdapter],
})
export class RedisModule {}
