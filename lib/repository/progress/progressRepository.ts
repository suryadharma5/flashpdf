import { prismaClient } from "@/lib/db";

export async function getChartData(userId: string) {
  const result = await prismaClient.history.groupBy({
    where: {
      userId,
    },
    by: ["documentId"],
    _count: {
      id: true,
    },
    _avg: {
      grade: true,
    },
  });

  const categoryData = await Promise.all(
    result.map(async (history) => {
      const document = await prismaClient.document.findUnique({
        where: { id: history.documentId },
        select: {
          Category: {
            select: { name: true },
          },
        },
      });

      return {
        category: document?.Category?.name ?? "Others",
        tests: history._count.id,
        averageGrade: Math.round(history._avg.grade ?? 0),
      };
    }),
  );

  return categoryData;
}

export async function getDocumentHistories(userId: string) {
  const documentHistories = await prismaClient.history.findMany({
    where: {
      userId: userId,
    },
    select: {
      document: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    distinct: ["documentId"],
  });

  if (!documentHistories) {
    return null;
  }

  return documentHistories;
}
