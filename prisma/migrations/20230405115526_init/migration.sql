/*
  Warnings:

  - Added the required column `recoveryIsUsed` to the `CredInfoUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CredInfoUser" ADD COLUMN     "recoveryIsUsed" BOOLEAN NOT NULL;
