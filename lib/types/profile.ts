import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const updateProfileSchema = z.object({
  username: z
    .string()
    .max(20, "Username must be no longer than 20 characters")
    .optional()
    .nullable(),
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size < MAX_FILE_SIZE)
    .refine((file) => {
      if (file?.size === 0 || !file) {
        return true;
      }

      return ["image/jpeg", "image/png"].includes(file.type);
    }, "Only JPEG and PNG image are allowed.")
    .nullable(),
});

export type TUpdateProfileSchema = z.infer<typeof updateProfileSchema>;
