-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "cms";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "identity";

-- CreateEnum
CREATE TYPE "identity"."tenantIssueEnumType" AS ENUM ('NO_PROJECT_FOUND', 'NO_CLIENT_FOUND');

-- CreateEnum
CREATE TYPE "identity"."userTypeEnumType" AS ENUM ('PARTICIPANT', 'CLIENT');

-- CreateEnum
CREATE TYPE "identity"."userIssueEnumType" AS ENUM ('FIRST_LOGIN_WAS_NOT_MADE');

-- CreateEnum
CREATE TYPE "cms"."projectStatusEnumType" AS ENUM ('OPEN', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "cms"."ticketStatusEnumType" AS ENUM ('OPEN', 'IN_PROGRESS', 'DONE');

-- CreateTable
CREATE TABLE "identity"."tenants" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "identifier" VARCHAR(80) NOT NULL,
    "ownerId" INTEGER,
    "issues" "identity"."tenantIssueEnumType"[] DEFAULT ARRAY['NO_CLIENT_FOUND', 'NO_PROJECT_FOUND']::"identity"."tenantIssueEnumType"[],
    "clientsCount" SMALLINT NOT NULL DEFAULT 0,
    "participantsCount" SMALLINT NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity"."users" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "type" "identity"."userTypeEnumType" NOT NULL,
    "issues" "identity"."userIssueEnumType"[] DEFAULT ARRAY['FIRST_LOGIN_WAS_NOT_MADE']::"identity"."userIssueEnumType"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms"."projects" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "title" VARCHAR(80) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "status" "cms"."projectStatusEnumType" NOT NULL DEFAULT 'OPEN',
    "clientUserIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms"."tickets" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "status" "cms"."ticketStatusEnumType" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_identifier_key" ON "identity"."tenants"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_ownerId_key" ON "identity"."tenants"("ownerId");

-- CreateIndex
CREATE INDEX "tenants_createdAt_idx" ON "identity"."tenants"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "tenants_issues_idx" ON "identity"."tenants" USING GIN ("issues");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "identity"."users"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "users_issues_idx" ON "identity"."users" USING GIN ("issues");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_tenantId_key" ON "identity"."users"("email", "tenantId");

-- CreateIndex
CREATE INDEX "projects_tenantId_createdAt_idx" ON "cms"."projects"("tenantId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "projects_clientUserIds_idx" ON "cms"."projects" USING GIN ("clientUserIds");

-- CreateIndex
CREATE INDEX "tickets_tenantId_createdAt_idx" ON "cms"."tickets"("tenantId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "identity"."users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "identity"."tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms"."tickets" ADD CONSTRAINT "tickets_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "cms"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
