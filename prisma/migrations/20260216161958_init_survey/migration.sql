-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('VENTA', 'POSTVENTA');

-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "conformidad" INTEGER NOT NULL,
    "atencionCliente" INTEGER NOT NULL,
    "satisfaccion" INTEGER NOT NULL,
    "recomendacion" INTEGER NOT NULL,
    "experiencia" INTEGER NOT NULL,
    "promedioGeneral" DOUBLE PRECISION NOT NULL,
    "source" TEXT DEFAULT 'google_forms',
    "formId" TEXT,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Survey_createdAt_idx" ON "Survey"("createdAt");

-- CreateIndex
CREATE INDEX "Survey_serviceType_idx" ON "Survey"("serviceType");

-- CreateIndex
CREATE INDEX "Survey_createdAt_serviceType_idx" ON "Survey"("createdAt", "serviceType");
