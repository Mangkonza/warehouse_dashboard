-- CreateTable
CREATE TABLE "system_health_check" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ok',
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_health_check_pkey" PRIMARY KEY ("id")
);
