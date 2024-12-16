"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuestions } from "@/hooks/useQuestion";
import { useUserAnswer } from "@/hooks/useUserAnswer";
import { BarChart, CheckCircle, XCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { LoadingPage } from "../../loading";

type ReviewProps = {
  documentId: string;
  historyId: string;
};

export default function Review({ documentId, historyId }: ReviewProps) {
  const { questions, isLoading, isError, isSuccess, error } =
    useQuestions(documentId);

  const {
    historyRecord,
    isLoading: historyLoading,
    isError: isHistoryError,
    error: historyError,
    isSuccess: historySuccess,
  } = useUserAnswer(documentId, historyId);

  if (isError || isHistoryError) {
    console.error(error);
    console.error(historyError);

    setTimeout(() => {
      redirect("/dashboard/home");
    }, 3000);

    toast.error("Oops, something went wrong.\n Redirecting to home page", {
      duration: 3000,
    });
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-start justify-center space-y-4 bg-background p-4 text-foreground md:flex-row md:space-x-4 md:space-y-0">
      {isLoading || historyLoading ? (
        <LoadingPage />
      ) : isSuccess && historySuccess ? (
        <>
          <Card className="w-full max-w-4xl shadow-lg">
            <CardHeader className="rounded-t-md">
              <CardTitle>
                <div className="flex items-center">
                  <div className="mr-2 rounded-sm bg-primary p-1">
                    <BarChart className="text-white" />
                  </div>
                  <p>Performance Summary</p>
                  <Badge className="ml-5">
                    {historyRecord.type.charAt(0).toUpperCase() +
                      historyRecord.type.slice(1).toLowerCase()}
                  </Badge>
                </div>
                <div className="mb-2 mt-6 flex items-center justify-between">
                  <span className="text-sm font-medium">Score</span>
                  <span className="text-sm font-bold">
                    {historyRecord.grade.toFixed(0)}%
                  </span>
                </div>
                <Progress value={historyRecord.grade} className="h-2" />
              </CardTitle>
            </CardHeader>

            <CardContent className="mt-3 space-y-6">
              {questions.map((question, idx) => (
                <div className="rounded-lg border px-6 pb-6 pt-4" key={idx}>
                  <div className="flex items-center justify-start">
                    <h2 className="text-xl font-semibold">
                      {idx + 1}. {question.question}
                    </h2>
                    {question.correctAnswer ===
                    historyRecord.AnswerHistory[idx].answer ? (
                      <CheckCircle className="ml-4 text-green-500" />
                    ) : (
                      <XCircle className="ml-4 text-red-500" />
                    )}
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {questions[idx]?.options.map((option, index) => {
                      const userAnswer =
                        historyRecord.AnswerHistory[idx].answer;
                      const isCorrect = option === question.correctAnswer;
                      const isUserAnswer = option === userAnswer;

                      return (
                        <div
                          key={index}
                          className={`h-auto w-full justify-start overflow-hidden whitespace-normal break-words rounded-md border px-2 py-6 text-left text-foreground transition-all ${isCorrect ? "bg-green-500" : ""} ${isUserAnswer && !isCorrect ? "bg-red-500" : ""} ${!isCorrect && !isUserAnswer ? "bg-background" : ""}`}
                        >
                          <span
                            className={`max-w-full text-sm ${isCorrect ? "font-semibo text-white" : ""} ${isUserAnswer && !isCorrect ? "font-semibo text-white" : ""}`}
                          >
                            {option}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}
