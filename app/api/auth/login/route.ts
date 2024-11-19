import { sendEmailVerification } from "@/lib/auth/mail/mail";
import { createVerificationTokenService } from "@/lib/auth/token/verification-token";
import { prismaClient } from "@/lib/db";
import { getUserByEmail } from "@/lib/repository/auth/userRepository";
import { loginSchema } from "@/lib/types/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.safeParse(body);

    if (!validatedData.success) {
      throw new Error("validation error");
    }

    const { email } = validatedData.data;

    const result = await prismaClient.$transaction(async (tx) => {
      const existingUser = await getUserByEmail(email, tx);

      if (!existingUser || !existingUser.email || !existingUser.password) {
        throw new Error("invalid credentials");
      }

      if (!existingUser.emailVerified) {
        const verficationToken = await createVerificationTokenService(
          existingUser.email,
          tx,
        );

        if (!verficationToken) {
          throw new Error("server error");
        }

        const emailSent = await sendEmailVerification(
          existingUser.email,
          verficationToken.token,
        );

        if (!emailSent) {
          throw new Error("server error");
        }

        return "email not verified";
      }
    });

    if (result === "email not verified") {
      return NextResponse.json(
        {
          status: 401,
          message: "Email not verified",
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(
      {
        status: 200,
        message: "Login success",
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    switch (error.message) {
      case "validation error":
        return NextResponse.json(
          {
            status: 400,
            message: "Invalid field format",
          },
          {
            status: 400,
          },
        );
      case "invalid credentials":
        return NextResponse.json(
          {
            status: 400,
            message: "Invalid credentials",
          },
          {
            status: 400,
          },
        );
      default:
        console.log("Transaction failed: ", error.message);
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
}
