-- CreateTable
CREATE TABLE "Configuration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "showSnow" BOOLEAN NOT NULL DEFAULT true,
    "customLocation" TEXT NOT NULL DEFAULT '1',
    "snowColor" TEXT NOT NULL DEFAULT '#ffffff',
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_shop_key" ON "Configuration"("shop");
