import { auth } from "@/auth";
import { prismaClient } from "@/lib/db";
import { PrismaTransaction } from "@/lib/repository/auth/tokenRepository";
import { TDocumentSchema } from "@/lib/types/question-form";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
      namespace: request.namespace,
      categoryId: request.category,
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
      user: {
        select: {
          id: true,
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
    include: {
      History: true,
      questions: {
        select: {
          question: true,
        },
      },
      Forum: {
        select: {
          id: true,
        },
      },
      Category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!documents) {
    return null;
  }

  return documents;
};

export const updateDocumentStatus = async (
  id: string,
  userId: string,
  isPublic: boolean,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;

  try {
    await prismaTx.document.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        isPublic: isPublic,
      },
    });

    return {
      success: true,
      message: "success",
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // Error: Record not found
        return {
          success: false,
          message: "not found",
        };
      }
    }

    return {
      success: false,
      message: "something went wrong",
    };
  }
};

export const deleteDocument = async (documentId: string, userId: string) => {
  const document = await getDocumentQuestion(documentId);

  if (!document) {
    return {
      status: 404,
      data: null,
    };
  }

  const deletedDocument = await prismaClient.document.delete({
    where: {
      id: documentId,
      userId,
    },
  });

  if (!deletedDocument) {
    return {
      status: 500,
      data: null,
    };
  }

  return {
    status: 200,
    data: deletedDocument,
  };
};
