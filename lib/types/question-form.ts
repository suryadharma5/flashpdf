import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_FILE_TYPE = "application/pdf";

export const questionFormSchema = z.object({
  document: z
    .any()
    .refine((file) => file instanceof File, "Document must be a file")
    .refine((file: File) => file?.size !== 0, "Document is required")
    .refine((file: File) => file?.size <= MAX_FILE_SIZE, "Max Size is 5 mb")
    .refine(
      (file: File) => file?.type === ACCEPTED_FILE_TYPE,
      "Only PDF files are accepted",
    )
    .nullable(),
  documentTitle: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must not exceed 50 characters")
    .trim()
    .refine((value) => value.length > 0, "Document title is required"),
  numQuestions: z
    .string()
    .refine((val) => {
      const number = Number(val);
      return !isNaN(number) && Number.isInteger(number);
    }, "Please input a valid number")
    .refine((val) => {
      const number = Number(val);
      return number >= 10 && number <= 50;
    }, "Number of questions must be between 10 and 50"),
  category: z
    .string()
    .min(3, "Category must be at least 3 characters")
    .max(50, "Category must not exceed 50 characters"),
});

const optionSchema = z.object({
  text: z.string().min(1, "Option text must be filled"),
});

const questionSchema = z
  .object({
    question: z.string().min(1, "Question text must be filled"),
    correctAnswer: z.string().min(1, "Correct answer must be filled"),
    options: z
      .array(optionSchema)
      .min(2, "There must be at least 2 options")
      .max(4, "The maximum options is 4"),
  })
  .refine(
    (data) => data.options.some((option) => option.text === data.correctAnswer),
    {
      message: "correctAnswer must match one of the texts in the options",
      path: ["correctAnswer"],
    },
  );

const flashcardSchema = z.object({
  keyPoint: z.string().min(1, "Key point must be filled"),
  explanation: z.string().min(1, "Explanation must be filled"),
});

/* eslint-disable @typescript-eslint/no-unused-vars */
const documentSchema = z.object({
  userId: z.string().min(1, "User id is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  questions: z
    .array(questionSchema)
    .min(1, "Dokumen harus memiliki minimal 1 pertanyaan"),
  flashcards: z
    .array(flashcardSchema)
    .min(1, "Document must have at least 1 flashcard"),
  namespace: z.string().min(1, "Namespace is required"),
  category: z.string().min(1, "Category is required"),
});
/* eslint-enable @typescript-eslint/no-unused-vars */

const testTypeEnum = z.enum(["PRETEST", "POSTTEST"]);

const historySchema = z.object({
  grade: z.number().min(0).max(100),
  type: testTypeEnum,
  userId: z.string().min(1),
  documentId: z.string().min(1),
});

const answerHistorySchema = z.object({
  answer: z.string().min(1),
  userId: z.string().min(1),
  historyId: z.string().optional(),
});

const questionHistorySchema = z.object({
  questionId: z.string().min(1),
  historyId: z.string().optional(),
});

const answerHistoriesSchema = z.array(answerHistorySchema).min(1);
const questionsHistorySchema = z.array(questionHistorySchema).min(1);

export const uploadHistorySchema = z.object({
  history: historySchema,
  answers: answerHistoriesSchema,
  questions: questionsHistorySchema,
});

export type TQuestionFormSchema = z.infer<typeof questionFormSchema>;
export type TDocumentSchema = z.infer<typeof documentSchema>;
export type TUploadHistorySchema = z.infer<typeof uploadHistorySchema>;
export type TTestTypeEnum = z.infer<typeof testTypeEnum>;
export type THistorySchema = z.infer<typeof historySchema>;
export type TAnswerHistoriesSchema = z.infer<typeof answerHistoriesSchema>;
export type TQuestionsHistorySchema = z.infer<typeof questionsHistorySchema>;
