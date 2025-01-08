import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export const PRISMA_SERVICE = Symbol('PRISMA_SERVICE');

export interface PrismaServiceSign
  extends PrismaClient,
    OnModuleInit,
    OnModuleDestroy {
  onModuleInit();

  onModuleDestroy();
}
