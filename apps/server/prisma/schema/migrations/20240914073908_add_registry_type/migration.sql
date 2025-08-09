-- CreateEnum
CREATE TYPE "RegistryType" AS ENUM ('NORMAL', 'GITHUB', 'GOOGLE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "registryType" "RegistryType" NOT NULL DEFAULT 'NORMAL';
