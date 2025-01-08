import { Injectable } from '@nestjs/common';
import { RedisAdapter } from 'libs/adapters/redis';

@Injectable()
export class CacheUseCase {
  constructor(private readonly redisAdapter: RedisAdapter) {}
}
