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

export async function getSavedDocument(userId: string, documentId: string) {
  const savedDocument = await prismaClient.savedDocument.findFirst({
    where: {
      userId,
      documentId,
    },
  });

  console.log({ savedDocument });

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
  const savedDocument = await prismaClient.savedDocument.deleteMany({
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
