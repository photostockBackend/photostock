/*
  Warnings:

  - You are about to drop the column `postPhotoLink` on the `Posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "postPhotoLink";

-- CreateTable
CREATE TABLE "PostPhotoLinks" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "PostPhotoLinks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostPhotoLinks" ADD CONSTRAINT "PostPhotoLinks_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
