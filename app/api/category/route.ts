import { prismaClient } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await prismaClient.category.findMany();

  if (!categories) {
    return NextResponse.json(
      {
        status: 500,
        error: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json(
    {
      status: 200,
      data: categories,
      message: "OK",
    },
    {
      status: 200,
    },
  );
}
