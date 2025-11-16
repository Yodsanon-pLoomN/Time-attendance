/*
  Warnings:

  - You are about to drop the `UserLocation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserLocation" DROP CONSTRAINT "UserLocation_locationId_fkey";

-- DropForeignKey
ALTER TABLE "UserLocation" DROP CONSTRAINT "UserLocation_userId_fkey";

-- DropTable
DROP TABLE "UserLocation";
