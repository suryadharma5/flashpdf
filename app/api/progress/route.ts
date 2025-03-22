import { auth } from "@/auth";
import { prismaClient } from "@/lib/db";
import { getChartData } from "@/lib/repository/progress/progressRepository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const documentId = searchParams.get("documentId");

  const session = await auth();
  const userId = session?.user.id;

  if (documentId) {
    const document = await prismaClient.document.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      return NextResponse.json(
        {
          message: "not found",
          status: 404,
        },
        {
          status: 404,
        },
      );
    }

    const histories = await prismaClient.history.findMany({
      where: {
        documentId,
        userId: userId,
      },
      select: {
        grade: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(
      {
        message: "OK",
        data: histories,
        status: 200,
      },
      {
        status: 200,
      },
    );
  }

  const data = await getChartData(userId);
  return NextResponse.json(
    {
      message: "OK",
      data: data,
      status: 200,
    },
    {
      status: 200,
    },
  );
}
