-- DropForeignKey
ALTER TABLE "answer_histories" DROP CONSTRAINT "answer_histories_historyId_fkey";

-- DropForeignKey
ALTER TABLE "answer_histories" DROP CONSTRAINT "answer_histories_userId_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_documentId_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_userId_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_userId_fkey";

-- DropForeignKey
ALTER TABLE "forums" DROP CONSTRAINT "forums_documentId_fkey";

-- DropForeignKey
ALTER TABLE "forums" DROP CONSTRAINT "forums_userId_fkey";

-- DropForeignKey
ALTER TABLE "histories" DROP CONSTRAINT "histories_documentId_fkey";

-- DropForeignKey
ALTER TABLE "histories" DROP CONSTRAINT "histories_userId_fkey";

-- DropForeignKey
ALTER TABLE "options" DROP CONSTRAINT "options_questionId_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_documentId_fkey";

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "options" ADD CONSTRAINT "options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "histories" ADD CONSTRAINT "histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "histories" ADD CONSTRAINT "histories_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_histories" ADD CONSTRAINT "answer_histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_histories" ADD CONSTRAINT "answer_histories_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "histories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forums" ADD CONSTRAINT "forums_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forums" ADD CONSTRAINT "forums_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
