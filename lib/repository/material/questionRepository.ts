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
      flashcards: {
        create: request.flashcards.map((flashcard) => ({
          keyPoint: flashcard.keyPoint,
          explanation: flashcard.explanation,
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

export const getFlashcardsData = async (documentId: string) => {
  const flashcardsData = await prismaClient.document.findUnique({
    where: {
      id: documentId!,
    },
    include: {
      flashcards: {
        select: {
          keyPoint: true,
          explanation: true,
        },
      },
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!flashcardsData) {
    return null;
  }

  return flashcardsData;
};

export const getAllDocuments = async (userId: string) => {
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

export const getDocumentTotalEntries = async (
  userId: string,
  query?: string,
  category?: string,
) => {
  const whereCondition: any = {
    userId: userId,
  };

  if (query && query.trim() !== "") {
    whereCondition.title = {
      contains: query,
      mode: "insensitive" as const,
    };
  }

  if (category && category.trim() !== "") {
    whereCondition.Category = {
      name: category,
    };
  }

  const totalCount = await prismaClient.document.aggregate({
    _count: {
      id: true,
    },
    where: whereCondition,
  });

  return totalCount;
};

export const getPaginatedDocuments = async (
  userId: string,
  limit: number,
  offset: number,
  query?: string,
  category?: string,
) => {
  const baseQuery = {
    skip: offset,
    take: limit,
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
  } as const;

  const whereCondition: any = {
    userId: userId,
  };

  if (query && query.trim() !== "") {
    whereCondition.title = {
      contains: query,
      mode: "insensitive" as const,
    };
  }

  if (category && category.trim() !== "") {
    whereCondition.Category = {
      name: category,
    };
  }

  const documents = await prismaClient.document.findMany({
    ...baseQuery,
    where: whereCondition,
  });

  if (!documents) {
    return null;
  }

  return documents;
};

export const getDocumentsByLimit = async (limit: number, userId: string) => {
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
    take: limit,
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
