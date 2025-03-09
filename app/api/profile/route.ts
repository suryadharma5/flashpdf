import { auth } from "@/auth";
import {
  getUserById,
  getUserByUsername,
  updateUserProfileImage,
  updateUserUsername,
} from "@/lib/repository/auth/userRepository";
import { bucketName, supabase } from "@/lib/supabase";
import { updateProfileSchema } from "@/lib/types/profile";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const formData = await req.formData();

  const profileImage = formData.get("image") as File;
  const username = formData.get("username") as string;

  const validatedField = updateProfileSchema.safeParse({
    username: username,
    image: profileImage,
  });

  if (!validatedField.success) {
    console.error(validatedField.error);
    return NextResponse.json(
      {
        message: "Invalid field format!",
        status: 400,
      },
      {
        status: 400,
      },
    );
  }

  const session = await auth();
  const userId = session?.user.id;

  const user = await getUserById(userId);

  if (!user) {
    return NextResponse.json(
      {
        message: "User not found",
        status: 404,
      },
      {
        status: 404,
      },
    );
  }

  if (profileImage) {
    if (user.image) {
      const imagePath = user.image.includes("/")
        ? user.image.split("/").pop()
        : user.image;

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([imagePath!]);

      if (error) {
        console.error(error);
        return NextResponse.json(
          {
            message: "Internal server error",
            status: 500,
          },
          {
            status: 500,
          },
        );
      }
    }

    const fileName = `${userId}-${profileImage.name}`;
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, profileImage);

    if (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: "Internal server error",
          status: 500,
        },
        {
          status: 500,
        },
      );
    }

    const { data: url } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    const updatedUser = await updateUserProfileImage(userId, url.publicUrl);

    if (!updatedUser) {
      return NextResponse.json(
        {
          message: "Internal server error",
          status: 500,
        },
        {
          status: 500,
        },
      );
    }
  }

  if (username) {
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Username already existed",
          status: 409,
        },
        {
          status: 409,
        },
      );
    }
    const updatedUser = await updateUserUsername(userId, username);

    if (!updatedUser) {
      return NextResponse.json(
        {
          message: "Internal server error",
          status: 500,
        },
        {
          status: 500,
        },
      );
    }
  }

  return NextResponse.json(
    {
      message: "OK",
      status: 200,
    },
    {
      status: 200,
    },
  );
}
