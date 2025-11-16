-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PASS', 'FAIL');

-- AlterTable
ALTER TABLE "AttendanceRecord" ADD COLUMN     "status" "AttendanceStatus" NOT NULL DEFAULT 'PASS';
