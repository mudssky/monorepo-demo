-- CreateTable
CREATE TABLE "SlowLogAnalysis" (
    "id" TEXT NOT NULL,
    "dbInstanceId" TEXT NOT NULL,
    "slowLogData" JSONB NOT NULL,
    "aiAnalysis" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SlowLogAnalysis_pkey" PRIMARY KEY ("id")
);
