import { prismaClient } from "@/lib/db";
import { PrismaTransaction } from "../auth/tokenRepository";

export const getChats = async (documentId: string, userId: string) => {
  const chats = await prismaClient.chat.findFirst({
    where: {
      AND: [
        {
          documentId: documentId,
        },
        {
          userId: userId,
        },
      ],
    },
  });

  if (!chats) {
    return null;
  }

  return chats;
};

export const saveChat = async (
  documentId: string,
  userId: string,
  newMessage: any,
  tx?: PrismaTransaction,
) => {
  const prismaTx = tx || prismaClient;

  const existingChat = await getChats(documentId, userId);

  if (!existingChat) {
    const newChat = await prismaTx.chat.create({
      data: {
        documentId,
        userId,
        messages: newMessage, // Buat array baru dengan pesan pertama
      },
    });

    return newChat;
  } else {
    if (Array.isArray(existingChat.messages)) {
      const updatedMessages = [...existingChat.messages, ...newMessage];

      const updatedChat = await prismaTx.chat.update({
        where: { id: existingChat.id },
        data: { messages: updatedMessages },
      });

      return updatedChat;
    }
  }
};
