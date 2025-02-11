import { z } from "zod";

export const forumSchema = z.object({
  title: z.string().min(1),
  description: z
    .string()
    .min(1)
    .max(100, "Description must be no longer than 30 characters"),
  documentId: z.string().min(1),
});

export const createForumSchema = z.object({
  title: z.string().min(1),
  description: z
    .string()
    .min(1)
    .max(100, "Description must be no longer than 30 characters"),
  documentId: z.string().min(1),
  userId: z.string().min(1),
});

export const deleteForumSchema = z.object({
  documentId: z.string().min(1),
  forumId: z.string().min(1),
});

export const commentSchema = z.object({
  comment: z.string().min(1),
  forumId: z.string().min(1),
});

export type TForumSchema = z.infer<typeof forumSchema>;
export type TCreateForumSchema = z.infer<typeof createForumSchema>;
export type TDeleteForumSchema = z.infer<typeof deleteForumSchema>;
export type TCommentSchema = z.infer<typeof commentSchema>;
