import { auth } from "@/auth";
import {
  createLike,
  deleteLike,
  getLikeById,
} from "@/lib/repository/forum/forumRepository";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  _: NextRequest,
  { params }: { params: { forumId: string } },
) {
  const forumId = params.forumId;

  if (forumId == null) {
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

  const existingLike = await getLikeById(forumId, session?.user.id);

  var likeCount = 0;

  if (!existingLike) {
    likeCount = await createLike(forumId, session?.user.id);
  } else {
    likeCount = await deleteLike(existingLike.id, forumId);
  }

  return NextResponse.json(
    {
      status: 200,
      message: "OK",
      totalLike: likeCount,
    },
    {
      status: 200,
    },
  );
}
