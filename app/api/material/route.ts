import { auth } from "@/auth";
import { prismaClient } from "@/lib/db";
import { loadDocumentIntoPineCone } from "@/lib/pinecone";
import {
  createDocumentQuestion,
  deleteDocument,
  deleteFlashcard,
  getAllDocuments,
  getDocumentQuestion,
  getDocumentsByLimit,
  getDocumentTotalEntries,
  getFlashcardsData,
  getPaginatedDocuments,
  updateFlashcard,
} from "@/lib/repository/material/questionRepository";
import { deleteHistory } from "@/lib/repository/material/testRepository";
import {
  editFlashcardSchema,
  questionFormSchema,
  TDocumentSchema,
} from "@/lib/types/question-form";
import { createQuestion } from "@/lib/util/openai-helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const session = await auth();

  const data = {
    document: formData.get("document") as File,
    documentTitle: formData.get("documentTitle") as string,
    numQuestions: formData.get("numQuestions") as string,
    category: formData.get("category") as string,
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

  const { document, documentTitle, numQuestions, category } =
    validatedData.data;

  const processedFile = await loadDocumentIntoPineCone(document, documentTitle);

  if (!processedFile) {
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

  const { documents, namespaceId: namespace } = processedFile;

  const combinedText = documents
    .flatMap((doc) => doc.map((chunk) => chunk.pageContent))
    .join(" ");

  const { generatedMaterial, usage } = await createQuestion(
    combinedText,
    numQuestions,
  );

  console.log("Question creation usage:", usage);

  const docData: TDocumentSchema = {
    userId: session?.user.id,
    title: documentTitle,
    questions: generatedMaterial.questions.map((q) => ({
      question: q.question,
      correctAnswer: q.correctAnswer,
      options: q.options.map((option) => ({
        text: option,
      })),
    })),
    flashcards: generatedMaterial.flashcards.map((f) => ({
      keyPoint: f.keyPoint,
      explanation: f.explanation,
    })),
    namespace: namespace,
    category: category,
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

  return NextResponse.json(
    {
      status: 201,
      data: result,
      message: "Document created",
    },
    {
      status: 201,
    },
  );
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const documentId = searchParams.get("documentId");
  const type = searchParams.get("type");
  const limit = searchParams.get("limit");
  const page = searchParams.get("page");
  const query = searchParams.get("query");
  const category = searchParams.get("category");

  const session = await auth();
  const userId = session?.user.id;

  if (documentId && type === "question") {
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
  } else if (documentId && type === "flashcard") {
    const flashcarsdData = await getFlashcardsData(documentId ?? "");

    if (!flashcarsdData) {
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
        data: flashcarsdData,
      },
      {
        status: 200,
      },
    );
  } else if (limit && page) {
    const currPage = parseInt(page) - 1 || 0;
    const currLimit = parseInt(limit) || 6;
    const offset = currPage * currLimit;

    const entries = await getDocumentTotalEntries(
      userId,
      query ?? "",
      category ?? "",
    );

    const totalEntries = entries._count.id;
    const totalPages = Math.ceil(totalEntries / currLimit);
    const hasNext = currPage + 1 < totalPages;
    const hasPrev = currPage > 0;

    const documents = await getPaginatedDocuments(
      userId,
      currLimit,
      offset,
      query ?? "",
      category ?? "",
    );

    const data = documents != null ? documents : [];

    return NextResponse.json(
      {
        message: "OK",
        data: {
          documents: data,
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
  } else if (limit) {
    const documents = await getDocumentsByLimit(parseInt(limit), userId);
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
  } else {
    const documents = await getAllDocuments(userId);
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

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const documentId = searchParams.get("documentId");
  const type = searchParams.get("type");
  const flashcardId = searchParams.get("flashcardId");

  if (type === "flashcard" && flashcardId) {
    const deletedFlashcard = await deleteFlashcard(flashcardId);

    if (!deletedFlashcard) {
      return NextResponse.json(
        {
          message: "Something went wrong",
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
  } else {
    if (!documentId) {
      return NextResponse.json(
        {
          message: "Document id is required",
          status: 400,
        },
        {
          status: 400,
        },
      );
    }

    const session = await auth();
    const userId = session?.user.id;

    const { status, data } = await deleteDocument(documentId, userId);

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
}

export async function PATCH(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const flashcardId = searchParams.get("flashcardId");
  const type = searchParams.get("type");

  const body = await req.json();

  if (type === "flashcard" && flashcardId) {
    const validatedData = editFlashcardSchema.safeParse(body);

    if (!validatedData.success) {
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

    const { keyPoint, explanation } = validatedData.data;
    const updateData: Partial<{ keyPoint: string; explanation: string }> = {};
    if (keyPoint) updateData.keyPoint = keyPoint;
    if (explanation) updateData.explanation = explanation;

    const updatedFlashcard = await updateFlashcard(flashcardId, updateData);

    if (!updatedFlashcard) {
      return NextResponse.json(
        {
          message: "Something went wrong",
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
        data: {
          keyPoint: updatedFlashcard.keyPoint,
          explanation: updatedFlashcard.explanation,
        },
      },
      {
        status: 200,
      },
    );
  } else {
    return NextResponse.json(
      {
        message: "Invalid type",
        status: 400,
      },
      {
        status: 400,
      },
    );
  }
}
