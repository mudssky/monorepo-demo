-- CreateEnum
CREATE TYPE "StorageType" AS ENUM ('LOCAL', 'ALIOSS', 'QINIU', 'TENCENT', 'UCLOUD', 'HUOBI', 'AWS', 'GCP', 'MINIO');

-- AlterTable
ALTER TABLE "UploadFiles" ADD COLUMN     "storageType" "StorageType" NOT NULL DEFAULT 'LOCAL';
