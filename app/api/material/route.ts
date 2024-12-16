import { auth } from "@/auth";
import { prismaClient } from "@/lib/db";
import {
  createDocumentQuestion,
  getAllDocuments,
  getDocumentQuestion,
} from "@/lib/repository/material/questionRepository";
import { questionFormSchema, TDocumentSchema } from "@/lib/types/question-form";
import { createQuestion } from "@/lib/util/openai-helper";
import { PDFPage, prepareDocument } from "@/lib/util/pdf-helper";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const data = {
    document: formData.get("document") as File,
    documentTitle: formData.get("documentTitle") as string,
    numQuestions: formData.get("numQuestions") as string,
  };

  const validatedData = questionFormSchema.safeParse(data);
  if (!validatedData.success) {
    console.log(validatedData.error.errors);
    return NextResponse.json(
      {
        status: 400,
        message: "Invalid field format",
      },
      {
        status: 400,
      },
    );
  }

  const loader = new PDFLoader(validatedData.data?.document ?? "");
  const pages = (await loader.load()) as PDFPage[];
  const documents = await Promise.all(
    pages.map((page) => prepareDocument(page)),
  );

  // TODO: save to pinecone
  // const vector = await Promise.all(documents.flat().map(vectoriseDocument));

  // console.log({ vector });

  const combinedText = documents
    .flatMap((doc) => doc.map((chunk) => chunk.pageContent))
    .join(" ");

  const session = await auth();

  const { questions, usage } = await createQuestion(
    combinedText,
    validatedData.data.numQuestions,
  );

  console.log("Question creation usage:", usage);

  const docData: TDocumentSchema = {
    userId: session?.user.id,
    title: validatedData.data.documentTitle,
    questions: questions.questions.map((q) => ({
      question: q.question,
      correctAnswer: q.correctAnswer,
      options: q.options.map((option) => ({
        text: option,
      })),
    })),
  };

  const result = await prismaClient.$transaction(async (tx) => {
    const docs = await createDocumentQuestion(docData, tx);

    if (!docs) {
      console.error("Failed to save question to db");
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

    return docs;
  });

  console.log({ result });

  return NextResponse.json(
    {
      status: 201,
      data: result,
      message: "Successfully created question",
    },
    {
      status: 201,
    },
  );
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const documentId = searchParams.get("documentId");

  if (documentId) {
    const documents = await getDocumentQuestion(documentId ?? "");

    if (!documents) {
      return NextResponse.json(
        {
          status: 404,
          message: "not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        status: 200,
        messsage: "OK",
        data: documents,
      },
      {
        status: 200,
      },
    );
  } else {
    const documents = await getAllDocuments();
    const data = documents != null ? documents : [];

    return NextResponse.json(
      {
        status: 200,
        messsage: "OK",
        data: data,
      },
      {
        status: 200,
      },
    );
  }
}
