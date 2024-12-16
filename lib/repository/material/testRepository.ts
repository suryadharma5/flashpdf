import { prismaClient } from "@/lib/db";
import { PrismaTransaction } from "@/lib/repository/auth/tokenRepository";
import {
  TAnswerHistoriesSchema,
  THistorySchema,
} from "@/lib/types/question-form";

export const createTestHistory = async (
  request: THistorySchema,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;

  const history = await prismaTx.history.create({
    data: request,
  });

  if (!history) {
    return null;
  }

  return history;
};

export const createAnswerHistory = async (
  request: TAnswerHistoriesSchema,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;

  const answerHistoryData = request.map((answer) => ({
    answer: answer.answer,
    userId: answer.userId,
    historyId: answer.historyId!,
  }));

  const answerHistory = await prismaTx.answerHistory.createMany({
    data: answerHistoryData,
  });

  return answerHistory;
};

export const getUserAnswerHistory = async (
  documentId: string,
  historyId: string,
  userId: string,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;

  const userAnswersHistory = await prismaTx.history.findFirst({
    where: {
      AND: [
        {
          id: historyId,
        },
        {
          documentId: documentId,
        },
        {
          userId: userId,
        },
      ],
    },
    include: {
      AnswerHistory: true,
    },
  });

  if (!userAnswersHistory) {
    return null;
  }

  return userAnswersHistory;
};
