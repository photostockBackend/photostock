/*
  Warnings:

  - The values [avatar,post_image] on the enum `fileType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `profileId` on the `Files` table. All the data in the column will be lost.
  - You are about to drop the column `postPhotoLinks` on the `Posts` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "fileType_new" AS ENUM ('image', 'video');
ALTER TABLE "Files" ALTER COLUMN "type" TYPE "fileType_new" USING ("type"::text::"fileType_new");
ALTER TYPE "fileType" RENAME TO "fileType_old";
ALTER TYPE "fileType_new" RENAME TO "fileType";
DROP TYPE "fileType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Files" DROP CONSTRAINT "Files_profileId_fkey";

-- DropIndex
DROP INDEX "Files_profileId_key";

-- AlterTable
ALTER TABLE "Files" DROP COLUMN "profileId";

-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "postPhotoLinks";

-- CreateTable
CREATE TABLE "ProfilePhotos" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "origResolution" TEXT,
    "minResolution" TEXT,

    CONSTRAINT "ProfilePhotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostFiles" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER,
    "origResolution" TEXT,
    "minResolution" TEXT,
    "mimeType" TEXT,

    CONSTRAINT "PostFiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePhotos_profileId_key" ON "ProfilePhotos"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "PostFiles_postId_key" ON "PostFiles"("postId");

-- AddForeignKey
ALTER TABLE "ProfilePhotos" ADD CONSTRAINT "ProfilePhotos_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ProfileInfoUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFiles" ADD CONSTRAINT "PostFiles_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
