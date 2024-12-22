import { auth } from "@/auth";
import { getChats, saveChat } from "@/lib/repository/chat/chatRepository";
import { getMostRecentUserMessage } from "@/lib/util/openai-helper";
import { openai } from "@ai-sdk/openai";
import {
  convertToCoreMessages,
  createDataStreamResponse,
  streamText,
} from "ai";
import { randomInt } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages, documentId } = body;

  const session = await auth();

  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  if (!userMessage) {
    return NextResponse.json(
      {
        status: 400,
        message: "No user message found",
      },
      {
        status: 400,
      },
    );
  }

  return createDataStreamResponse({
    execute: async (dataStream) => {
      dataStream.writeData({
        type: "user-message-id",
        content: randomInt(10),
      });

      try {
        const result = streamText({
          model: openai("gpt-4o-mini"),
          prompt: userMessage.content.toString(),
          //   messages: userMessage.content,
          maxTokens: 1000,
          onFinish: async () => {
            const usage = await result.usage;
            console.log("Chat cost", usage);
          },
          experimental_telemetry: {
            isEnabled: true,
            functionId: "stream-text",
          },
        });
        result.mergeIntoDataStream(dataStream);

        let responseData = "";

        for await (const textPart of result.textStream) {
          responseData += textPart;
        }

        const jsonData = [
          {
            role: userMessage.role,
            content: userMessage.content.toString(),
          },
          {
            role: "assistant",
            content: responseData,
          },
        ];

        const data = await saveChat(documentId, session?.user.id, jsonData);

        console.log({ data });
      } catch (error) {
        console.error("Error in streamText:", error);
      }
    },
  });
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const documentId = searchParams.get("documentId");

  const session = await auth();
  const userId = session?.user.id;

  if (!documentId || !userId) {
    return NextResponse.json(
      {
        status: 400,
        message: "bad request",
      },
      {
        status: 400,
      },
    );
  }

  const documents = await getChats(documentId ?? "", userId);

  return NextResponse.json(
    {
      status: 200,
      data: documents,
      message: "OK",
    },
    {
      status: 200,
    },
  );
}
