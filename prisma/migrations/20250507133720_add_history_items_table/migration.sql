-- CreateTable
CREATE TABLE "history_items" (
    "id" VARCHAR(40) NOT NULL,
    "historyId" VARCHAR(40) NOT NULL,
    "questionId" VARCHAR(40) NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "history_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "history_items" ADD CONSTRAINT "history_items_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "histories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_items" ADD CONSTRAINT "history_items_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
