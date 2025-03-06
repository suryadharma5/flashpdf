import { auth } from "@/auth";
import {
  deleteSavedDocument,
  getSavedDocument,
  getSavedDocumentsByUserId,
  saveDocument,
} from "@/lib/repository/save/saveRepository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const documentId = searchParams.get("documentId");

  if (documentId == null) {
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

  const savedDocument = await getSavedDocument(userId, documentId);

  if (!savedDocument) {
    const documents = await saveDocument(userId, documentId);

    if (!documents) {
      return NextResponse.json(
        {
          status: 500,
          message: "Internal Server Error",
        },
        {
          status: 500,
        },
      );
    }
  } else {
    const documents = await deleteSavedDocument(userId, documentId);

    if (!documents) {
      return NextResponse.json(
        {
          status: 500,
          message: "Internal Server Error",
        },
        {
          status: 500,
        },
      );
    }
  }

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

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const documentId = searchParams.get("documentId");

  const session = await auth();
  const userId = session?.user.id;

  let data;

  if (documentId) {
    data = await getSavedDocument(userId, documentId);
  } else {
    data = await getSavedDocumentsByUserId(userId);
  }

  return NextResponse.json(
    {
      status: 200,
      data: data,
      message: "OK",
    },
    {
      status: 200,
    },
  );
}
