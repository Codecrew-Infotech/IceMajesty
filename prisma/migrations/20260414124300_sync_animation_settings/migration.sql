-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Configuration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "customLocation" TEXT NOT NULL DEFAULT 'allpages',
    "animationType" TEXT NOT NULL DEFAULT 'snowfall',
    "animationCount" INTEGER NOT NULL DEFAULT 80,
    "animationSize" INTEGER NOT NULL DEFAULT 30,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Configuration" ("customLocation", "id", "shop", "updatedAt") SELECT "customLocation", "id", "shop", "updatedAt" FROM "Configuration";
DROP TABLE "Configuration";
ALTER TABLE "new_Configuration" RENAME TO "Configuration";
CREATE UNIQUE INDEX "Configuration_shop_key" ON "Configuration"("shop");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
