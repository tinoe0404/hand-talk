-- CreateTable
CREATE TABLE "Radiographer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "patientRef" TEXT NOT NULL,
    "isFirstDay" BOOLEAN NOT NULL DEFAULT false,
    "isLastDay" BOOLEAN NOT NULL DEFAULT false,
    "radiographerId" TEXT NOT NULL,
    CONSTRAINT "Session_radiographerId_fkey" FOREIGN KEY ("radiographerId") REFERENCES "Radiographer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InstructionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "instructionId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,
    CONSTRAINT "InstructionLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GestureLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gestureType" TEXT NOT NULL,
    "confidence" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,
    CONSTRAINT "GestureLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmergencyLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stage" INTEGER NOT NULL,
    "triageSelection" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,
    CONSTRAINT "EmergencyLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
