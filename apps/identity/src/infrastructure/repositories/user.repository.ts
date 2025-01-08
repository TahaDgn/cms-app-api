// apps/identity/src/infrastructure/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserType } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(
    tenantId: number,
    email: string,
    name: string,
    type: UserType,
  ) {
    const user = await this.prisma.user.create({
      data: {
        tenantId,
        email,
        name,
        type,
      },
    });
    return {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      name: user.name,
      type: user.type,
      issues: user.issues,
    };
  }

  async findByEmailAndTenantIdentifier(
    email: string,
    tenantIdentifier: string,
  ) {
    // Prisma multi schema: identity.tenant, identity.user
    // Tek tabloda join => or, bir custom query
    const tenant = await this.prisma.tenant.findUnique({
      where: { identifier: tenantIdentifier },
    });
    if (!tenant) return null;
    const user = await this.prisma.user.findFirst({
      where: { tenantId: tenant.id, email },
    });
    return user
      ? {
          id: user.id,
          tenantId: user.tenantId,
          email: user.email,
          name: user.name,
          type: user.type,
          issues: user.issues,
        }
      : null;
  }

  async findById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return null;
    return {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      name: user.name,
      type: user.type,
      issues: user.issues,
    };
  }

  async removeFirstLoginIssue(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;
    const updatedIssues = user.issues.filter(
      (iss) => iss !== 'FIRST_LOGIN_WAS_NOT_MADE',
    );
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        issues: updatedIssues,
      },
    });
  }

  async findAllByTenant(tenantId: number) {
    const users = await this.prisma.user.findMany({
      where: { tenantId },
    });
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      type: u.type,
      issues: u.issues,
    }));
  }

  async deleteUser(userId: number) {
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
