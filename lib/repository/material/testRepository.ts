import { prismaClient } from "@/lib/db";
import { PrismaTransaction } from "@/lib/repository/auth/tokenRepository";
import {
  TAnswerHistoriesSchema,
  THistorySchema,
  TQuestionsHistorySchema,
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

export const createQuestionsHistory = async (
  request: TQuestionsHistorySchema,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;

  const questionsHistoryData = request.map((question) => ({
    questionId: question.questionId,
    historyId: question.historyId!,
  }));

  const questionsHistory = await prismaTx.questionHistory.createMany({
    data: questionsHistoryData,
  });

  return questionsHistory;
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
      QuestionHistory: {
        select: {
          question: {
            select: {
              correctAnswer: true,
              question: true,
              options: true,
            },
          },
        },
      },
    },
  });

  if (!userAnswersHistory) {
    return null;
  }

  return userAnswersHistory;
};

export const getUserHistoriesByDocumentId = async (
  documentId: string,
  userId: string,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;

  const userHistory = await prismaTx.history.findMany({
    where: {
      AND: [
        {
          documentId: documentId,
        },
        {
          userId: userId,
        },
      ],
    },
    include: {
      document: {
        select: {
          id: true,
          createdAt: true,
          title: true,
          updatedAt: true,
          userId: true,
          Category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!userHistory) {
    return null;
  }

  console.log({ userHistory });

  return userHistory;
};

export const getUserAnswerHistories = async (
  userId: string,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;

  const userAnswersHistory = await prismaTx.history.findMany({
    where: {
      userId: userId,
    },
    include: {
      document: {
        select: {
          title: true,
          Category: {
            select: {
              name: true,
            },
          },
        },
      },
      AnswerHistory: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    distinct: ["documentId"],
  });

  if (!userAnswersHistory) {
    return null;
  }

  const testStats = await prismaTx.history.groupBy({
    by: ["documentId"],
    where: {
      userId: userId,
    },
    _count: {
      documentId: true,
    },
    _avg: {
      grade: true,
    },
  });

  // const averageGrade = await prismaTx.history.groupBy({});

  const historyWithStats = userAnswersHistory.map((history) => {
    const stats = testStats.find((ts) => ts.documentId === history.documentId);

    return {
      ...history,
      takeTestCount: stats?._count.documentId || 0,
      averageGrade: stats?._avg.grade || history.grade,
    };
  });

  return historyWithStats;
};

export const getUserProgressHistory = async (
  userId: string,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;

  const userAnswersHistory = await prismaTx.history.findMany({
    where: {
      userId: userId,
    },
    include: {
      document: {
        select: {
          title: true,
          Category: {
            select: {
              name: true,
            },
          },
        },
      },
      AnswerHistory: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!userAnswersHistory) {
    return null;
  }

  return userAnswersHistory;
};

export const deleteHistory = async (userId: string, documentId: string) => {
  const userHistory = await prismaClient.history.findFirst({
    where: {
      userId,
      documentId,
    },
  });

  if (userHistory) {
    const deletedHistory = await prismaClient.history.deleteMany({
      where: {
        userId,
        documentId,
      },
    });

    if (!deletedHistory) {
      return { status: 500, data: null };
    }
  }

  return { status: 200 };
};
