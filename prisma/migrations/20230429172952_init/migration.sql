/*
  Warnings:

  - You are about to drop the column `profilePhotoLink` on the `ProfileInfoUser` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "fileType" AS ENUM ('avatar', 'post_image');

-- CreateEnum
CREATE TYPE "fileStatus" AS ENUM ('uploaded', 'deleted');

-- CreateEnum
CREATE TYPE "resolutions" AS ENUM ('thumbnail', 'original');

-- AlterTable
ALTER TABLE "ProfileInfoUser" DROP COLUMN "profilePhotoLink";

-- CreateTable
CREATE TABLE "Files" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER,
    "sizeInBytes" INTEGER NOT NULL,
    "type" "fileType" NOT NULL,
    "status" "fileStatus" NOT NULL,
    "extension" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileKeys" (
    "id" SERIAL NOT NULL,
    "fileId" INTEGER NOT NULL,
    "resolution" "resolutions" NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "FileKeys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Files_profileId_key" ON "Files"("profileId");

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ProfileInfoUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileKeys" ADD CONSTRAINT "FileKeys_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
