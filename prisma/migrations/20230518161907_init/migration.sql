/*
  Warnings:

  - The `mimeType` column on the `PostFiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `postId` on table `PostFiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PostFiles" ALTER COLUMN "postId" SET NOT NULL,
DROP COLUMN "mimeType",
ADD COLUMN     "mimeType" "fileType";
