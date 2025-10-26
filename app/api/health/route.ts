import { prismaClient } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  await prismaClient.forumLike.count();

  return NextResponse.json(
    { message: "OK" },
    {
      status: 200,
    },
  );
}
