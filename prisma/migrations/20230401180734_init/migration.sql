-- DropForeignKey
ALTER TABLE "CredInfoUser" DROP CONSTRAINT "CredInfoUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "TokenInfoUser" DROP CONSTRAINT "TokenInfoUser_userId_fkey";

-- AddForeignKey
ALTER TABLE "CredInfoUser" ADD CONSTRAINT "CredInfoUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenInfoUser" ADD CONSTRAINT "TokenInfoUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
