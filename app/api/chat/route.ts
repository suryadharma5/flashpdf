import { auth } from "@/auth";
import { getContext, getMatchScore } from "@/lib/pinecone";
import { getChats, saveChat } from "@/lib/repository/chat/chatRepository";
import {
  getMostRecentUserMessage,
  getPreviousQuestion,
} from "@/lib/util/openai-helper";
import { openai } from "@ai-sdk/openai";
import {
  convertToCoreMessages,
  createDataStreamResponse,
  streamText,
} from "ai";
import { randomInt } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are an AI assistant that can handle greetings and context-based questions.
You must ONLY use information from the context to answer questions.
Remember previous questions and answers in the conversation to handle follow-up questions naturally.

For greetings:
- Respond naturally and friendly
- Match the user's language style

For ANY questions (not greetings):
If context is empty or no context provided, you MUST respond with:
- For Indonesian: "Maaf, saya tidak dapat menemukan jawaban untuk pertanyaan tersebut."
- For English: "I'm sorry, but I don't know the answer to that question."

START CONTEXT BLOCK
{{context}}
END OF CONTEXT BLOCK

Remember:
- If context is empty and question is about specific information, ALWAYS respond with the "cannot find answer" message
- Only answer specific questions if there is actual context provided
- Always match the language of the user's question
`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages, documentId, namespace } = body;

  const session = await auth();

  var enhancedQuery = "";
  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);
  const previousQuestion = getPreviousQuestion(coreMessages);

  const query = userMessage?.content.toString();
  const lastQuestion = previousQuestion?.content.toString();

  enhancedQuery = query ?? "";

  if (lastQuestion) {
    const matchScore = await getMatchScore(lastQuestion, namespace);

    if (matchScore !== "") {
      enhancedQuery = `${lastQuestion} | ${query}`;
    } else {
      enhancedQuery = query ?? "";
    }
  }

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

  const context = await getContext(enhancedQuery, namespace);

  const prompt = SYSTEM_PROMPT.replace("{{context}}", context);

  return createDataStreamResponse({
    execute: async (dataStream) => {
      dataStream.writeData({
        type: "user-message-id",
        content: randomInt(10),
      });

      try {
        const result = streamText({
          model: openai("gpt-4o-mini"),
          prompt: enhancedQuery,
          system: prompt,
          maxTokens: 1000,
          temperature: 0.3,
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

        await saveChat(documentId, session?.user.id, jsonData);
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
