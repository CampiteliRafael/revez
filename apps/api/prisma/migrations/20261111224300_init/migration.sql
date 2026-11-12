-- CreateEnum
CREATE TYPE "RequestCategory" AS ENUM ('IT', 'INFRASTRUCTURE', 'ADMINISTRATIVE', 'PURCHASES', 'HR');

-- CreateEnum
CREATE TYPE "RequestPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'WAITING', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "displayName" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "RequestCategory" NOT NULL,
    "priority" "RequestPriority" NOT NULL,
    "dueDate" TIMESTAMPTZ(3) NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'NEW',
    "createdById" TEXT NOT NULL,
    "assigneeId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestEvent" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "payload" JSONB,
    "requestId" TEXT NOT NULL,
    "actorId" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE INDEX "Request_status_createdAt_idx" ON "Request"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Request_category_idx" ON "Request"("category");

-- CreateIndex
CREATE INDEX "Request_assigneeId_status_idx" ON "Request"("assigneeId", "status");

-- CreateIndex
CREATE INDEX "Request_teamId_status_idx" ON "Request"("teamId", "status");

-- CreateIndex
CREATE INDEX "Comment_requestId_createdAt_idx" ON "Comment"("requestId", "createdAt");

-- CreateIndex
CREATE INDEX "RequestEvent_requestId_createdAt_idx" ON "RequestEvent"("requestId", "createdAt");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestEvent" ADD CONSTRAINT "RequestEvent_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestEvent" ADD CONSTRAINT "RequestEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
