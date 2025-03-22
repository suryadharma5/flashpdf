/*
  Warnings:

  - A unique constraint covering the columns `[namespace]` on the table `documents` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `namespace` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "namespace" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "documents_namespace_key" ON "documents"("namespace");
