import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

type AnswerHistoryProps = {
  id: string;
  answer: string;
};

export type HistoryProps = {
  grade: number;
  type: string;
  createdAt: string;
  AnswerHistory: AnswerHistoryProps[];
};

export const useUserAnswer = (documentId: string, historyId: string) => {
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["fetchUserAnswer", documentId, historyId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/material/history?documentId=${documentId}&historyId=${historyId}`,
      );

      return res.data;
    },
    enabled: !!documentId && !!historyId,
  });

  const historyRecord: HistoryProps = data?.data;

  return {
    historyRecord,
    isLoading,
    isError,
    isSuccess,
    error,
  };
};
