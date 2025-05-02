/*
  Warnings:

  - You are about to drop the `saved_documents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "saved_documents" DROP CONSTRAINT "saved_documents_documentId_fkey";

-- DropForeignKey
ALTER TABLE "saved_documents" DROP CONSTRAINT "saved_documents_userId_fkey";

-- DropTable
DROP TABLE "saved_documents";

-- CreateTable
CREATE TABLE "saved_study_materials" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_study_materials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "saved_study_materials_userId_documentId_key" ON "saved_study_materials"("userId", "documentId");

-- AddForeignKey
ALTER TABLE "saved_study_materials" ADD CONSTRAINT "saved_study_materials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_study_materials" ADD CONSTRAINT "saved_study_materials_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
