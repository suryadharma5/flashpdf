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
    ),
  documentTitle: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must not exceed 50 characters")
    .trim()
    .refine((value) => value.length > 0, "Document title is required"),
  numQuestions: z
    .number()
    .int()
    .min(1, "Minimum 10 questions required")
    .max(50, "Maximum 50 questions allowed")
    .refine((value) => !isNaN(value), "Number of questions is required"),
});

export type TQuestionFormSchema = z.infer<typeof questionFormSchema>;
