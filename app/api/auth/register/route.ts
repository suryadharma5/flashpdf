import { sendEmailVerification } from "@/lib/auth/mail/mail";
import { createVerificationTokenService } from "@/lib/auth/token/verification-token";
import { prismaClient } from "@/lib/db";
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from "@/lib/repository/auth/userRepository";
import { registerSchema, UserResponse } from "@/lib/types/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.safeParse(body);

    if (!validatedData.success) {
      throw new Error("validation error");
    }

    const { username, email } = validatedData.data;

    const result: UserResponse = await prismaClient.$transaction(async (tx) => {
      const isEmailExisted = await getUserByEmail(email, tx);

      if (isEmailExisted) {
        throw new Error("email existed");
      }

      const isUsernameExisted = await getUserByUsername(username, tx);

      if (isUsernameExisted) {
        throw new Error("username existed");
      }

      const user = await createUser(validatedData.data, tx);

      if (!user) {
        throw new Error("server error");
      }

      const verficationToken = await createVerificationTokenService(
        user.email,
        tx,
      );

      if (!verficationToken) {
        throw new Error("server error");
      }

      const emailSent = await sendEmailVerification(
        user.email,
        verficationToken.token,
      );

      if (!emailSent) {
        throw new Error("server error");
      }

      return {
        user: {
          ...user,
          token: verficationToken.token,
        },
      };
    });

    return NextResponse.json(
      {
        status: 201,
        message: "user created",
        data: { ...result },
      },
      {
        status: 201,
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
      case "username existed":
        return NextResponse.json(
          {
            status: 400,
            message: "Username already existed",
          },
          {
            status: 400,
          },
        );
      case "email existed":
        return NextResponse.json(
          {
            status: 400,
            message: "Email already existed",
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
            message: "Registration failed",
          },
          {
            status: 500,
          },
        );
    }
  }
}
