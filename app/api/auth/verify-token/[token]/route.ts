import { verifyVerificationToken } from "@/lib/auth/token/verification-token";
import { prismaClient } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: {
      token: string;
    };
  },
) {
  try {
    const { token } = await params;

    const result = await prismaClient.$transaction(async (tx) => {
      const { error } = await verifyVerificationToken(token, tx);

      if (error) {
        return { error };
      }

      return { success: true };
    });

    if (result.error) {
      switch (result.error) {
        case "expired":
          return NextResponse.json(
            { status: 400, message: "token expired" },
            { status: 400 },
          );
        case "token not found":
        case "user not found":
          return NextResponse.json(
            { status: 404, message: "not found" },
            { status: 404 },
          );
        default:
          return NextResponse.json(
            { status: 500, message: "internal server error" },
            { status: 500 },
          );
      }
    }

    return NextResponse.json(
      { status: 200, message: "email verified" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Unexpected error: ", error);
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
}
