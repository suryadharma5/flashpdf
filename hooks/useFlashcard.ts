import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type FlashCardDataProps = {
  id: string;
  keyPoint: string;
  explanation: string;
};

export const useFlashcard = (documentId: string) => {
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["fetchFlashcardData", documentId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/material?documentId=${documentId}&type=flashcard`,
      );
      return res.data;
    },
    enabled: !!documentId,
  });

  const flashcardsData: FlashCardDataProps[] =
    data?.data.flashcards.map((f: FlashCardDataProps) => ({
      id: f.id,
      keyPoint: f.keyPoint,
      explanation: f.explanation,
    })) || [];

  let documentTitle = "";
  let namespace = "";
  let userId = "";

  if (isSuccess) {
    documentTitle = data.data.title;
    namespace = data.data.namespace;
    userId = data.data.user.id;
  }

  return {
    documentTitle,
    flashcardsData,
    isLoading,
    isError,
    isSuccess,
    error,
    namespace,
    documentId,
    userId,
  };
};
