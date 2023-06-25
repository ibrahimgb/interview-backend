-- CreateTable
CREATE TABLE "Currency" (
    "currency" TEXT NOT NULL,
    "storeExchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "minExchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "maxExchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 1,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("currency")
);
