-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT,
    "foundedAt" TEXT,
    "description" TEXT,
    "website" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Cloud" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "providerId" TEXT NOT NULL,
    CONSTRAINT "Cloud_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "version" TEXT,
    "description" TEXT,
    "releasedAt" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "cloudId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    CONSTRAINT "Model_cloudId_fkey" FOREIGN KEY ("cloudId") REFERENCES "Cloud" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Model_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "score" INTEGER NOT NULL,
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modelId" TEXT NOT NULL,
    CONSTRAINT "Rating_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "author" TEXT NOT NULL DEFAULT '匿名用户',
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 3,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modelId" TEXT NOT NULL,
    CONSTRAINT "Review_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" INTEGER NOT NULL,
    "reviewId" TEXT NOT NULL,
    CONSTRAINT "Vote_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'reported',
    "occurredAt" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "modelId" TEXT NOT NULL,
    CONSTRAINT "Incident_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Provider_name_key" ON "Provider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_slug_key" ON "Provider"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Cloud_providerId_slug_key" ON "Cloud"("providerId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Model_cloudId_slug_key" ON "Model"("cloudId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_reviewId_key" ON "Vote"("reviewId");
