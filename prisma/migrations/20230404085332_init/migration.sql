/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `TokenInfoUser` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `TokenInfoUser` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `TokenInfoUser` table. All the data in the column will be lost.
  - Added the required column `deviceIp` to the `TokenInfoUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deviceName` to the `TokenInfoUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expirationAt` to the `TokenInfoUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenInfoUser" DROP COLUMN "expiresAt",
DROP COLUMN "ip",
DROP COLUMN "title",
ADD COLUMN     "deviceIp" TEXT NOT NULL,
ADD COLUMN     "deviceName" TEXT NOT NULL,
ADD COLUMN     "expirationAt" INTEGER NOT NULL;
