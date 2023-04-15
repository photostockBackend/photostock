-- CreateTable
CREATE TABLE "Posts" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "postPhotoLink" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
