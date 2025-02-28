import { auth } from "@/auth";
import { prismaClient } from "@/lib/db";
import { loadDocumentIntoPineCone } from "@/lib/pinecone";
import { saveNotes, getNotes, updateNotes } from "@/lib/repository/material/noteRepository";
import {
  createDocumentQuestion,
  getAllDocuments,
  getDocumentQuestion,
} from "@/lib/repository/material/questionRepository";
import { questionFormSchema, TDocumentSchema } from "@/lib/types/question-form";
import { createQuestion } from "@/lib/util/openai-helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const searchParams = req.nextUrl.searchParams;
  const documentId = searchParams.get("documentId");

  if (!documentId) {
    return NextResponse.json(
      {
        status: 400,
        message: "Bad Request",
      },
      {
        status: 400,
      },
    );
  }

  const user = await auth();
  const userId = user?.user.id;

  const newNotes = await saveNotes(documentId ?? "", userId ?? "", body.notes);

  if (!newNotes) {
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

  return NextResponse.json(
    {
      status: 201,
      message: "Created",
      data: newNotes,
    },
    {
      status: 201,
    },
  );

}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const documentId = searchParams.get("documentId");

  if (!documentId) {
    return NextResponse.json(
      {
        status: 400,
        message: "Bad Request",
      },
      {
        status: 400,
      },
    );
  }

  const user = await auth();
  const userId = user?.user.id;

  const notes = await getNotes(documentId ?? "", userId ?? "");

  const data = notes ? notes.notes : "";

  console.log("fetched notes from db", data);

  return NextResponse.json(
    {
      status: 200,
      message: "OK",
      data,
    },
    {
      status: 200,
    },
  );

}

  export async function PUT(req: NextRequest) {
    const body = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const documentId = searchParams.get("documentId");

    console.log("PUT request received", documentId, body);
  
    if (!documentId) {
      return NextResponse.json(
        { status: 400, message: "Bad Request" },
        { status: 400 }
      );
    }
  
    const user = await auth();
    const userId = user?.user.id;
  
    const updatedNotes = await updateNotes(documentId ?? "", userId ?? "", body.notes);
  
    if (!updatedNotes) {
      return NextResponse.json(
        { status: 500, message: "Internal Server Error" },
        { status: 500 }
      );
    }

    console.log("updatedNotes", updatedNotes);
  
    return NextResponse.json(
      { status: 200, message: "Updated", data: updatedNotes },
      { status: 200 }
    );
  }

    

