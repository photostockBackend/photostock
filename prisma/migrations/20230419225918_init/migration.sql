/*
  Warnings:

  - You are about to drop the `PostPhotoLinks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostPhotoLinks" DROP CONSTRAINT "PostPhotoLinks_postId_fkey";

-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "postPhotoLinks" TEXT[];

-- DropTable
DROP TABLE "PostPhotoLinks";
