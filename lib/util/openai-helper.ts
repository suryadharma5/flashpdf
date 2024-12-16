import { openai } from "@ai-sdk/openai";
import { embed, generateObject } from "ai";
import { z } from "zod";

export const createQuestion = async (text: string, numOfQuestions: string) => {
  console.log(`Generating ${numOfQuestions} questions...`);

  const { object: questions, usage } = await generateObject({
    model: openai("gpt-4o-mini"),
    maxTokens: 700,
    temperature: 0.5,
    prompt: `
        Create ${numOfQuestions} multiple-choice questions based on the following text. Use the format:
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

export const summarizeText = async (text: string) => {
  const { object: keyContent, usage } = await generateObject({
    model: openai("gpt-4o-mini"),
    maxTokens: 500,
    temperature: 0.3,
    prompt: `
        Extract the most important sections from the following text:
        ---
        ${text}
        ---
        Instructions: 
        - Identify key concepts
        - Extract critical information
        - Highlight main arguments
        - Select essential details for understanding
    `,
    schema: z.object({
      keyParagraphs: z
        .array(z.string())
        .describe("Most important paragraphs that capture core knowledge"),
      mainConcepts: z
        .array(z.string())
        .describe("Core ideas that should be the basis for questions"),
      centralTheme: z.string().describe("Overall theme or subject of the text"),
    }),
  });

  console.log("Usage of summarizing paragraph:", usage);

  return (
    keyContent.keyParagraphs.join("\n") +
    "\n\nMain Concepts:\n" +
    keyContent.mainConcepts.join("\n")
  );
};

export const embedDocument = async (text: string) => {
  const { embedding, usage } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: text.replace(/\n/g, " "),
  });

  console.log("Embedding cost:", usage);

  return embedding as number[];
};
