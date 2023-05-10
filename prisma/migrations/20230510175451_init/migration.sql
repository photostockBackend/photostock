/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Payments` table. All the data in the column will be lost.
  - Added the required column `periodEnd` to the `Payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodStart` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "createdAt",
ADD COLUMN     "periodEnd" INTEGER NOT NULL,
ADD COLUMN     "periodStart" INTEGER NOT NULL;
