/*
  Warnings:

  - The primary key for the `CredInfoUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `passwordSalt` on the `CredInfoUser` table. All the data in the column will be lost.
  - The `id` column on the `CredInfoUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `TokenInfoUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `TokenInfoUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `codeExpiresAt` to the `CredInfoUser` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userId` on the `CredInfoUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `TokenInfoUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CredInfoUser" DROP CONSTRAINT "CredInfoUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "TokenInfoUser" DROP CONSTRAINT "TokenInfoUser_userId_fkey";

-- AlterTable
ALTER TABLE "CredInfoUser" DROP CONSTRAINT "CredInfoUser_pkey",
DROP COLUMN "passwordSalt",
ADD COLUMN     "codeExpiresAt" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "CredInfoUser_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TokenInfoUser" DROP CONSTRAINT "TokenInfoUser_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "TokenInfoUser_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "CredInfoUser_userId_key" ON "CredInfoUser"("userId");

-- AddForeignKey
ALTER TABLE "CredInfoUser" ADD CONSTRAINT "CredInfoUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenInfoUser" ADD CONSTRAINT "TokenInfoUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
