import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

type OptionProps = {
  text: string;
};

type QuestionHistoryProps = {
  correctAnswer: string;
  question: string;
  options: OptionProps[];
};

type HistoryItemsProps = {
  answer: string;
  question: QuestionHistoryProps;
};

export type HistoryProps = {
  grade: number;
  type: string;
  createdAt: string;
  HistoryItems: HistoryItemsProps[];
};

export const useUserAnswer = (historyId: string) => {
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["fetchUserAnswer", historyId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/history?&historyId=${historyId}`,
      );

      return res.data;
    },
    enabled: !!historyId,
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
