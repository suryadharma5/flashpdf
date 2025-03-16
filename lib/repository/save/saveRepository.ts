import { prismaClient } from "@/lib/db";

export async function getSavedDocumentsByUserId(userId: string) {
  const savedDocuments = await prismaClient.savedDocument.findMany({
    where: {
      userId,
    },
    select: {
      documentId: true,
      document: {
        select: {
          title: true,
          user: {
            select: {
              username: true,
            },
          },
          History: {
            select: {
              id: true,
              type: true,
            },
            where: {
              userId,
            },
          },
          Category: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              questions: true,
            },
          },
        },
      },
    },
  });

  if (!savedDocuments) {
    return null;
  }

  return savedDocuments;
}

export async function getPaginatedSavedDocumentsByUserId(
  userId: string,
  limit: number,
  offset: number,
) {
  const savedDocuments = await prismaClient.savedDocument.findMany({
    skip: offset,
    take: limit,
    where: {
      userId,
    },
    select: {
      document: {
        select: {
          id: true,
          title: true,
          user: {
            select: {
              username: true,
            },
          },
          History: {
            select: {
              id: true,
              type: true,
            },
            where: {
              userId,
            },
          },
          Category: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              questions: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!savedDocuments) {
    return null;
  }

  return savedDocuments;
}

export async function getSavedDocument(userId: string, documentId: string) {
  const savedDocument = await prismaClient.savedDocument.findFirst({
    where: {
      userId,
      documentId,
    },
  });

  if (!savedDocument) {
    return null;
  }

  return savedDocument;
}

export async function saveDocument(userId: string, documentId: string) {
  const savedDocument = await prismaClient.savedDocument.create({
    data: {
      userId,
      documentId,
    },
  });

  if (!savedDocument) {
    return null;
  }

  return savedDocument;
}

export async function deleteSavedDocument(userId: string, documentId: string) {
  const savedDocument = await prismaClient.savedDocument.findFirst({
    where: {
      userId,
      documentId,
    },
  });

  if (!savedDocument) {
    return { status: 404, data: null };
  }

  const deletedDocument = await prismaClient.savedDocument.deleteMany({
    where: {
      userId,
      documentId,
    },
  });

  if (!deletedDocument) {
    return { status: 500, data: null };
  }

  return { status: 200, data: deletedDocument };
}

export const getSavedDocumentTotalEntries = async (userId: string) => {
  const savedDocuments = await prismaClient.savedDocument.aggregate({
    _count: {
      id: true,
    },
    where: {
      userId,
    },
  });

  return savedDocuments;
};
