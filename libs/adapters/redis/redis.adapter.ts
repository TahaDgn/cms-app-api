import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisAdapter implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  async onModuleInit() {
    const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

    this.client = createClient({ url: REDIS_URL });

    this.client.on('error', (err) => {
      console.error('Redis error: ', err);
    });

    await this.client.connect();

    console.log('Redis connected.');
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.disconnect();
    }
  }

  public async setKey(key: string, value: string, expireSeconds?: number) {
    await this.client.set(key, value);
    if (expireSeconds) {
      await this.client.expire(key, expireSeconds);
    }
  }

  public async getKey(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  public async delKey(key: string) {
    await this.client.del(key);
  }

  public async lPush(key: string, value: string) {
    await this.client.lPush(key, value);
  }

  public async lRange(key: string, start = 0, stop = -1) {
    return this.client.lRange(key, start, stop);
  }
}
