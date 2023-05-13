-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CredInfoUser" (
    "id" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "passwordSalt" TEXT NOT NULL,
    "isActivated" BOOLEAN NOT NULL,
    "code" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CredInfoUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenInfoUser" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "issuedAt" INTEGER NOT NULL,
    "expiresAt" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TokenInfoUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CredInfoUser_userId_key" ON "CredInfoUser"("userId");

-- AddForeignKey
ALTER TABLE "CredInfoUser" ADD CONSTRAINT "CredInfoUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenInfoUser" ADD CONSTRAINT "TokenInfoUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
