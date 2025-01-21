import { Tenant, TenantIssue } from '@prisma/client';

export class GetTenantPResponsePayload implements Tenant {
  id: number;

  name: string;

  projectsCount: number;

  identifier: string;

  ownerId: number;

  issues: TenantIssue[];

  clientsCount: number;

  participantsCount: number;

  createdAt: Date;

  updatedAt: Date;
}
