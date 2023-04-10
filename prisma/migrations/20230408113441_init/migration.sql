-- CreateTable
CREATE TABLE "ProfileInfoUser" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surName" TEXT NOT NULL,
    "dateOfBirthday" TIMESTAMP(3) NOT NULL,
    "city" TEXT NOT NULL,
    "aboutMe" TEXT NOT NULL,
    "profilePhotoLink" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ProfileInfoUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileInfoUser_userId_key" ON "ProfileInfoUser"("userId");

-- AddForeignKey
ALTER TABLE "ProfileInfoUser" ADD CONSTRAINT "ProfileInfoUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
