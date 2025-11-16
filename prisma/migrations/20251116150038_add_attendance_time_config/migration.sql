-- CreateTable
CREATE TABLE "AttendanceTimeConfig" (
    "id" TEXT NOT NULL,
    "eventType" "AttendanceEventType" NOT NULL,
    "startMinute" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceTimeConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceTimeConfig_eventType_key" ON "AttendanceTimeConfig"("eventType");
