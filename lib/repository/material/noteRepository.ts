import { prismaClient } from "@/lib/db";
import { PrismaTransaction } from "../auth/tokenRepository";

export const getNotes = async (documentId: string, userId: string) => {
  const notes = await prismaClient.notes.findFirst({
    where: {
      documentId: documentId,
      userId: userId,
    },
  });

  if (!notes) {
    return null;
  }

  return notes;
};

export const saveNotes = async (
  documentId: string,
  userId: string,
  message: string,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;

  const existingNotes = await getNotes(documentId, userId);

  if (!existingNotes) {
    const newNotes = await prismaTx.notes.create({
      data: {
        documentId,
        userId,
        notes: message,
      },
    });

    return newNotes;
  } else {
    console.log("existingNotes", existingNotes);
    if (existingNotes.notes) {
      console.log("existingNotes.messages is an array");
      const updatedMessages = existingNotes.notes.concat(message);
      const updatedNotes = await prismaTx.notes.update({
        where: { id: existingNotes.id },
        data: { notes: updatedMessages },
      });

      console.log("updatedNotes", updatedNotes);

      return updatedNotes;
    } else {
      console.log("existingNotes.messages is not an array");
    }
  }
};

export const updateNotes = async (
  documentId: string,
  userId: string,
  newContent: string,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;

  const existingNotes = await prismaTx.notes.findFirst({
    where: { documentId, userId },
  });

  if (!existingNotes) {
    console.log("No existing notes");
    return null; // No existing notes, should not update anything
  }

  const updatedNotes = await prismaTx.notes.update({
    where: { id: existingNotes.id },
    data: { notes: newContent }, // REPLACES the existing content
  });

  console.log("updatedNotes", updatedNotes);
  return updatedNotes;
};
