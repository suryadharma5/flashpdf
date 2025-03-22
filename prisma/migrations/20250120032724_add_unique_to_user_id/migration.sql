/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `documents` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "documents_userId_key" ON "documents"("userId");
