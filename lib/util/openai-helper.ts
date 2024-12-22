import { openai } from "@ai-sdk/openai";
import {
  CoreAssistantMessage,
  CoreMessage,
  CoreToolMessage,
  embed,
  generateObject,
  streamText,
} from "ai";
import { z } from "zod";

export const createQuestion = async (text: string, numOfQuestions: string) => {
  console.log(`Generating ${numOfQuestions} questions...`);

  const { object: questions, usage } = await generateObject({
    model: openai("gpt-4o-mini"),
    maxTokens: 700,
    temperature: 0.5,
    prompt: `
        Create 1 multiple-choice questions based on the following text. Use the format:
        - Question
        - Options (A, B, C, D)
        - Correct Answer
        ---
        ${text}
    `,
    schema: z.object({
      questions: z.array(
        z.object({
          question: z.string().describe("Teks pertanyaan"),
          options: z
            .array(z.string())
            .length(4)
            .describe("Pilihan jawaban A, B, C, D"),
          correctAnswer: z
            .string()
            .describe(
              "Teks jawaban benar, harus sesuai dengan salah satu opsi",
            ),
        }),
      ),
    }),
  });

  return { questions, usage };
};

export const chatAI = (prompt: string) => {
  const result = streamText({
    model: openai("gpt-4o-mini"),
    prompt: prompt,
  });

  console.log(result.usage);

  // for await (const textPart of textStream) {
  //   process.stdout.write(textPart);
  // }

  return result.toDataStreamResponse({});
};

export const embedDocument = async (text: string) => {
  const { embedding, usage } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: text.replace(/\n/g, " "),
  });

  console.log("Embedding cost:", usage);

  return embedding as number[];
};

export function getMostRecentUserMessage(messages: Array<CoreMessage>) {
  const userMessages = messages.filter((message) => message.role === "user");
  return userMessages.at(-1);
}

export function sanitizeResponseMessages(
  messages: Array<CoreToolMessage | CoreAssistantMessage>,
): Array<CoreToolMessage | CoreAssistantMessage> {
  const toolResultIds: Array<string> = [];

  for (const message of messages) {
    if (message.role === "tool") {
      for (const content of message.content) {
        if (content.type === "tool-result") {
          toolResultIds.push(content.toolCallId);
        }
      }
    }
  }

  const messagesBySanitizedContent = messages.map((message) => {
    if (message.role !== "assistant") return message;

    if (typeof message.content === "string") return message;

    const sanitizedContent = message.content.filter((content) =>
      content.type === "tool-call"
        ? toolResultIds.includes(content.toolCallId)
        : content.type === "text"
          ? content.text.length > 0
          : true,
    );

    return {
      ...message,
      content: sanitizedContent,
    };
  });

  return messagesBySanitizedContent.filter(
    (message) => message.content.length > 0,
  );
}
