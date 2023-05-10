/*
  Warnings:

  - Added the required column `customerId` to the `PaymentsInfoUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentsInfoUser" ADD COLUMN     "customerId" TEXT NOT NULL;
