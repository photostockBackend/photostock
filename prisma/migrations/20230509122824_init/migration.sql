-- CreateEnum
CREATE TYPE "paymentService" AS ENUM ('stripe', 'paypal', 'roboKassa');

-- CreateTable
CREATE TABLE "PaymentsInfoUser" (
    "id" SERIAL NOT NULL,
    "paymentMethodId" TEXT NOT NULL,
    "paymentService" "paymentService" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PaymentsInfoUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" SERIAL NOT NULL,
    "createdAt" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "paymentInfoId" INTEGER NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaymentsInfoUser" ADD CONSTRAINT "PaymentsInfoUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_paymentInfoId_fkey" FOREIGN KEY ("paymentInfoId") REFERENCES "PaymentsInfoUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
