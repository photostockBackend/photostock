/*
  Warnings:

  - You are about to drop the `BanInfoUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "userStatus" AS ENUM ('active', 'ban');

-- DropForeignKey
ALTER TABLE "BanInfoUser" DROP CONSTRAINT "BanInfoUser_userId_fkey";

-- DropTable
DROP TABLE "BanInfoUser";

-- CreateTable
CREATE TABLE "StatusInfoUser" (
    "id" SERIAL NOT NULL,
    "status" "userStatus" NOT NULL,
    "statusReason" TEXT NOT NULL,
    "statusDate" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "StatusInfoUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StatusInfoUser_userId_key" ON "StatusInfoUser"("userId");

-- AddForeignKey
ALTER TABLE "StatusInfoUser" ADD CONSTRAINT "StatusInfoUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
