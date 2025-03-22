-- CreateTable
CREATE TABLE "questions_history" (
    "id" TEXT NOT NULL,
    "historyId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "questions_history" ADD CONSTRAINT "questions_history_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "histories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions_history" ADD CONSTRAINT "questions_history_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
