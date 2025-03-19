import { auth } from "@/auth";
import { prismaClient } from "@/lib/db";
import {
  createForum,
  deleteForum,
  findForumById,
  getAllForum,
  getForumsByLimit,
  getPaginatedForums,
  getTotalForumEntries,
} from "@/lib/repository/forum/forumRepository";
import { updateDocumentStatus } from "@/lib/repository/material/questionRepository";
import { forumSchema, TCreateForumSchema } from "@/lib/types/forum";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validatedData = forumSchema.safeParse(body.data);

  if (!validatedData.success) {
    console.error(validatedData.error);
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

  const session = await auth();
  const userId: string = session!.user.id;

  const forumData: TCreateForumSchema = {
    ...validatedData.data,
    userId,
  };

  try {
    await prismaClient.$transaction(async (tx) => {
      const forum = await createForum(forumData, tx);

      if (!forum) {
        throw new Error("failed to create forum");
      }

      const { message, success } = await updateDocumentStatus(
        validatedData.data.documentId,
        userId,
        true,
        tx,
      );

      if (!success) {
        throw new Error(message);
      }

      return forum;
    });

    return NextResponse.json(
      {
        status: 201,
        message: "Created",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (error instanceof Error && error.message == "not found") {
      return NextResponse.json(
        {
          status: 404,
          message: "Not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        status: 500,
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const forumId = searchParams.get("forumId");
  const documentId = searchParams.get("documentId");

  if (forumId == null || documentId == null) {
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

  try {
    await prismaClient.$transaction(async (tx) => {
      const forum = await findForumById(forumId, tx);

      if (!forum) {
        return NextResponse.json(
          {
            status: 404,
            message: "Forum not found",
          },
          {
            status: 404,
          },
        );
      }

      const session = await auth();
      const userId: string = session!.user.id;

      const { success } = await deleteForum(forumId, userId, tx);

      if (!success) {
        throw new Error("Internal server error");
      }

      const { success: updateSuccess, message } = await updateDocumentStatus(
        documentId,
        userId,
        false,
        tx,
      );

      if (!updateSuccess) {
        throw new Error(message);
      }
    });

    return NextResponse.json(
      {
        status: 200,
        message: "OK",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof Error && error.message == "not found") {
      return NextResponse.json(
        {
          status: 404,
          message: "Not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        status: 500,
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const limit = searchParams.get("limit");
  const page = searchParams.get("page");
  const query = searchParams.get("query");
  const category = searchParams.get("category");

  const session = await auth();

  if (limit && page) {
    const currPage = parseInt(page) - 1 || 0;
    const currLimit = parseInt(limit) || 6;
    const offset = currPage * currLimit;

    const entries = await getTotalForumEntries(query ?? "", category ?? "");

    const totalEntries = entries._count.id;
    const totalPages = Math.ceil(totalEntries / currLimit);
    const hasNext = currPage + 1 < totalPages;
    const hasPrev = currPage > 0;

    const forums = await getPaginatedForums(
      session?.user.id,
      currLimit,
      offset,
      query ?? "",
      category ?? "",
    );

    const data = forums != null ? forums : [];

    const formattedData = data.map((forum) => ({
      ...forum,
      isLiked: forum.likes.length > 0,
    }));

    return NextResponse.json(
      {
        status: 200,
        data: {
          forums: formattedData,
          totalEntries: totalEntries,
          totalPages: totalPages,
          hasNext: hasNext,
          hasPrev: hasPrev,
        },
        message: "OK",
      },
      {
        status: 200,
      },
    );
  } else if (limit) {
    const forums = await getForumsByLimit(session?.user.id, parseInt(limit));
    const data = forums !== null ? forums : [];

    const formattedData = data.map((forum) => ({
      ...forum,
      isLiked: forum.likes.length > 0,
    }));

    return NextResponse.json(
      {
        status: 200,
        data: formattedData,
        message: "OK",
      },
      {
        status: 200,
      },
    );
  }

  const forums = await getAllForum(session?.user.id);
  const data = forums !== null ? forums : [];

  const formattedData = data.map((forum) => ({
    ...forum,
    isLiked: forum.likes.length > 0,
  }));

  return NextResponse.json(
    {
      status: 200,
      data: formattedData,
      message: "OK",
    },
    {
      status: 200,
    },
  );
}
