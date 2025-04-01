import { auth } from "@/auth";
import { prismaClient } from "@/lib/db";
import { updateUserStreak } from "@/lib/repository/auth/userRepository";
import {
  createAnswerHistory,
  createQuestionsHistory,
  createTestHistory,
  getUserAnswerHistories,
  getUserAnswerHistory,
  getUserHistoriesByDocumentId,
  getUserProgressHistory,
} from "@/lib/repository/material/testRepository";
import { uploadHistorySchema } from "@/lib/types/question-form";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const validatedData = uploadHistorySchema.safeParse(body.data);

  if (!validatedData.success) {
    console.log(validatedData.error);
    return NextResponse.json(
      {
        status: 400,
        message: "Invalid field type",
      },
      {
        status: 400,
      },
    );
  }

  const historyData = validatedData.data.history;
  const answersData = validatedData.data.answers;
  const questionsData = validatedData.data.questions;

  const result = await prismaClient.$transaction(async (tx) => {
    const history = await createTestHistory(historyData, tx);

    if (!history) {
      return NextResponse.json(
        {
          status: 500,
          message: "internal server error",
        },
        {
          status: 500,
        },
      );
    }

    const answersWithHistoryId = answersData.map((answer) => ({
      ...answer,
      historyId: history.id,
    }));

    const userAnswers = await createAnswerHistory(answersWithHistoryId, tx);

    if (!userAnswers) {
      return NextResponse.json(
        {
          status: 500,
          message: "internal server error",
        },
        {
          status: 500,
        },
      );
    }

    const questionsWithHistoryId = questionsData.map((q) => ({
      ...q,
      historyId: history.id,
    }));

    const questionsHistory = await createQuestionsHistory(
      questionsWithHistoryId,
      tx,
    );

    if (!questionsHistory) {
      return NextResponse.json(
        {
          status: 500,
          message: "internal server error",
        },
        {
          status: 500,
        },
      );
    }

    const session = await auth();
    const userId = session?.user.id;

    await updateUserStreak(userId);

    return history;
  });

  return NextResponse.json(
    {
      status: 201,
      message: "created",
      data: result,
    },
    {
      status: 201,
    },
  );
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const documentId = searchParams.get("documentId");
  const historyId = searchParams.get("historyId");
  const type = searchParams.get("type");
  const userId = await auth();

  if (historyId && documentId) {
    const userAnswers = await getUserAnswerHistory(
      documentId,
      historyId,
      userId!.user.id,
    );

    if (!userAnswers) {
      return NextResponse.json(
        {
          status: 404,
          message: "not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        status: 200,
        data: userAnswers,
        message: "OK",
      },
      {
        status: 200,
      },
    );
  } else if (documentId) {
    const histories = await getUserHistoriesByDocumentId(
      documentId,
      userId!.user.id,
    );

    const data = histories != null ? histories : [];

    return NextResponse.json(
      {
        status: 200,
        data: data,
        message: "OK",
      },
      {
        status: 200,
      },
    );
  } else if (type === "progress") {
    const histories = await getUserProgressHistory(userId!.user.id);
    const data = histories != null ? histories : [];

    return NextResponse.json(
      {
        status: 200,
        data: data,
        message: "OK",
      },
      {
        status: 200,
      },
    );
  } else {
    const histories = await getUserAnswerHistories(userId!.user.id);
    const data = histories != null ? histories : [];

    return NextResponse.json(
      {
        status: 200,
        data: data,
        message: "OK",
      },
      {
        status: 200,
      },
    );
  }
}
