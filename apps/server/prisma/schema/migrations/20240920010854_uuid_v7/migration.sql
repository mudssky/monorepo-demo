/*
  Warnings:

  - The primary key for the `MeetingRooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ShortUrl` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UploadFiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `casbin_rule` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "MeetingRooms" DROP CONSTRAINT "MeetingRooms_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "MeetingRooms_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MeetingRooms_id_seq";

-- AlterTable
ALTER TABLE "ShortUrl" DROP CONSTRAINT "ShortUrl_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ShortUrl_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ShortUrl_id_seq";

-- AlterTable
ALTER TABLE "UploadFiles" DROP CONSTRAINT "UploadFiles_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "UploadFiles_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "UploadFiles_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "casbin_rule" DROP CONSTRAINT "casbin_rule_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "casbin_rule_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "casbin_rule_id_seq";

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");
