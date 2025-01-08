import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantRepository {
  constructor(private prisma: PrismaService) {}

  async createTenant(name: string, identifier: string) {
    return this.prisma.tenant.create({
      data: {
        name,
        identifier,
      },
    });
  }

  async setOwner(tenantId: number, ownerId: number) {
    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: { ownerId },
    });
  }

  async incrementClientCount(tenantId: number) {
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        clientsCount: { increment: 1 },
      },
    });
  }

  async incrementParticipantCount(tenantId: number) {
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        participantsCount: { increment: 1 },
      },
    });
  }

  async decrementClientCount(tenantId: number) {
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        clientsCount: { decrement: 1 },
      },
    });
  }

  async decrementParticipantCount(tenantId: number) {
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        participantsCount: { decrement: 1 },
      },
    });
  }
}
