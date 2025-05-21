import { auth } from "@/auth";
import {
  createComment,
  deleteComment,
  getCommentsById,
} from "@/lib/repository/forum/forumRepository";
import { commentSchema } from "@/lib/types/forum";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const validatedData = commentSchema.safeParse(body.data);

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

  const session = await auth();
  const { comment, forumId } = validatedData.data;

  const newComment = await createComment(forumId, session?.user.id, comment);

  if (!newComment) {
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

  return NextResponse.json(
    {
      status: 201,
      message: "success",
    },
    {
      status: 201,
    },
  );
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ forumId: string }> },
) {
  const forumId = (await params).forumId;
  const comments = await getCommentsById(forumId);
  const data = comments === null ? [] : comments;

  return NextResponse.json(
    {
      status: 200,
      data,
      message: "OK",
    },
    {
      status: 200,
    },
  );
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const commentId = searchParams.get("commentId");

  if (commentId === null) {
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
  const userId = session?.user.id;

  const { status } = await deleteComment(commentId, userId);

  switch (status) {
    case 404:
      return NextResponse.json(
        {
          status: 404,
          message: "comment not found",
        },
        {
          status: 404,
        },
      );
    case 500:
      return NextResponse.json(
        {
          status: 500,
          message: "internal server error",
        },
        {
          status: 500,
        },
      );
    default:
      return NextResponse.json(
        {
          status: 200,
          message: "OK",
        },
        {
          status: 200,
        },
      );
  }
}
