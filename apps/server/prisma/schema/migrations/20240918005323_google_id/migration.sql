/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ShortURLStatus" AS ENUM ('ENABLE', 'DISABLE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleAuthInfo" TEXT,
ADD COLUMN     "googleId" TEXT;

-- CreateTable
CREATE TABLE "ShortUrl" (
    "id" SERIAL NOT NULL,
    "status" "ShortURLStatus" NOT NULL DEFAULT 'DISABLE',
    "code" TEXT NOT NULL,
    "longUrl" TEXT,

    CONSTRAINT "ShortUrl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingRooms" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "MeetingRooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "casbin_rule" (
    "id" SERIAL NOT NULL,
    "ptype" TEXT NOT NULL,
    "v0" TEXT,
    "v1" TEXT,
    "v2" TEXT,
    "v3" TEXT,
    "v4" TEXT,
    "v5" TEXT,

    CONSTRAINT "casbin_rule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortUrl_code_key" ON "ShortUrl"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ShortUrl_longUrl_key" ON "ShortUrl"("longUrl");

-- CreateIndex
CREATE INDEX "ShortUrl_code_idx" ON "ShortUrl"("code");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
