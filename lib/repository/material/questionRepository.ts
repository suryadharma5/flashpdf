import { auth } from "@/auth";
import { prismaClient } from "@/lib/db";
import { PrismaTransaction } from "@/lib/repository/auth/tokenRepository";
import { TDocumentSchema } from "@/lib/types/question-form";

export const createDocumentQuestion = async (
  request: TDocumentSchema,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;

  const docs = await prismaTx.document.create({
    data: {
      userId: request.userId,
      title: request.title,
      questions: {
        create: request.questions.map((question) => ({
          question: question.question,
          correctAnswer: question.correctAnswer,
          options: {
            create: question.options.map((option) => ({
              text: option.text,
            })),
          },
        })),
      },
    },
  });

  if (!docs) {
    return null;
  }

  return docs;
};

export const getDocumentQuestion = async (documentId: string) => {
  const documents = await prismaClient.document.findUnique({
    where: {
      id: documentId!,
    },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  if (!documents) {
    return null;
  }

  return documents;
};

export const getAllDocuments = async () => {
  const session = await auth();
  const userId = session?.user.id;

  const documents = await prismaClient.document.findMany({
    where: {
      userId: userId,
    },
    // select: {
    //   id: true,
    //   createdAt: true,
    //   title: true,
    // },
  });

  if (!documents) {
    return null;
  }

  return documents;
};
