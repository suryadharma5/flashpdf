import { auth } from "@/auth";
import {
  createComment,
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
  { params }: { params: { forumId: string } },
) {
  const comments = await getCommentsById(params.forumId);
  const data = comments === null ? [] : comments;

  return NextResponse.json(
    {
      status: 201,
      data,
      message: "success",
    },
    {
      status: 201,
    },
  );
}
