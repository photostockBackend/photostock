/*
  Warnings:

  - You are about to drop the column `dateOfBirthday` on the `ProfileInfoUser` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ProfileInfoUser` table. All the data in the column will be lost.
  - You are about to drop the column `surName` on the `ProfileInfoUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProfileInfoUser" DROP COLUMN "dateOfBirthday",
DROP COLUMN "name",
DROP COLUMN "surName",
ADD COLUMN     "birthday" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "aboutMe" DROP NOT NULL,
ALTER COLUMN "profilePhotoLink" DROP NOT NULL;
