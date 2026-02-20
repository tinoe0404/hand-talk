/*
  Warnings:

  - You are about to drop the column `patientRef` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Session` table. All the data in the column will be lost.
  - Added the required column `patientMrn` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientName` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `treatmentType` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "patientName" TEXT NOT NULL,
    "patientMrn" TEXT NOT NULL,
    "treatmentType" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isFirstDay" BOOLEAN NOT NULL DEFAULT false,
    "isLastDay" BOOLEAN NOT NULL DEFAULT false,
    "radiographerId" TEXT NOT NULL,
    CONSTRAINT "Session_radiographerId_fkey" FOREIGN KEY ("radiographerId") REFERENCES "Radiographer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("endTime", "id", "isFirstDay", "isLastDay", "radiographerId") SELECT "endTime", "id", "isFirstDay", "isLastDay", "radiographerId" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
