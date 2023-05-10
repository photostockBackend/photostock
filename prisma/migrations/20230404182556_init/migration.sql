/*
  Warnings:

  - Changed the type of `codeExpiresAt` on the `CredInfoUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CredInfoUser" DROP COLUMN "codeExpiresAt",
ADD COLUMN     "codeExpiresAt" TIMESTAMP(3) NOT NULL;
