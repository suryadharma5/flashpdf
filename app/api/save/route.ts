import { auth } from "@/auth";
import { deleteHistory } from "@/lib/repository/material/testRepository";
import {
  deleteSavedDocument,
  getPaginatedSavedDocumentsByUserId,
  getSavedDocument,
  getSavedDocumentsByUserId,
  getSavedDocumentTotalEntries,
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
  const limit = searchParams.get("limit");
  const page = searchParams.get("page");
  const query = searchParams.get("query");
  const category = searchParams.get("category");

  const session = await auth();
  const userId = session?.user.id;

  let data;

  if (documentId) {
    data = await getSavedDocument(userId, documentId);

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
  } else if (limit && page) {
    const currPage = parseInt(page) - 1 || 0;
    const currLimit = parseInt(limit) || 6;
    const offset = currPage * currLimit;

    const entries = await getSavedDocumentTotalEntries(
      userId,
      query ?? "",
      category ?? "",
    );

    const totalEntries = entries._count.id;
    const totalPages = Math.ceil(totalEntries / currLimit);
    const hasNext = currPage + 1 < totalPages;
    const hasPrev = currPage > 0;

    const savedDocuments = await getPaginatedSavedDocumentsByUserId(
      userId,
      currLimit,
      offset,
      query ?? "",
      category ?? "",
    );

    return NextResponse.json(
      {
        message: "OK",
        data: {
          documents: savedDocuments,
          totalEntries,
          totalPages,
          hasNext,
          hasPrev,
        },
        status: 200,
      },
      {
        status: 200,
      },
    );
  }

  data = await getSavedDocumentsByUserId(userId);

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

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const documentId = searchParams.get("documentId");

  const session = await auth();
  const userId = session?.user.id;

  if (!documentId) {
    return NextResponse.json(
      {
        message: "Document is required",
        status: 400,
      },
      {
        status: 400,
      },
    );
  }

  const { data, status } = await deleteSavedDocument(userId, documentId);

  if (data === null && status === 404) {
    return NextResponse.json(
      {
        message: "Document not found",
        status: 404,
      },
      {
        status: 404,
      },
    );
  } else if (data === null && status === 500) {
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

  const { data: dataHistory, status: statusHistory } = await deleteHistory(
    userId,
    documentId,
  );

  if (dataHistory === null && statusHistory === 404) {
    return NextResponse.json(
      {
        message: "Document not found",
        status: 404,
      },
      {
        status: 404,
      },
    );
  } else if (dataHistory === null && statusHistory === 500) {
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
