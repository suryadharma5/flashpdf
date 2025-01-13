import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type QuestionProps = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export const useQuestions = (documentId: string) => {
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["fetchQuestion", documentId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/material?documentId=${documentId}`,
      );
      return res.data;
    },
    enabled: !!documentId,
  });

  const questions: QuestionProps[] =
    data?.data.questions.map((q: any) => ({
      question: q.question,
      options: q.options.map((opt: any) => opt.text),
      correctAnswer: q.correctAnswer,
    })) || [];

  let documentTitle = "";
  let namespace = "";

  if (isSuccess) {
    documentTitle = data.data.title;
    namespace = data.data.namespace;
  }

  return {
    documentTitle,
    questions,
    isLoading,
    isError,
    isSuccess,
    error,
    namespace,
  };
};
