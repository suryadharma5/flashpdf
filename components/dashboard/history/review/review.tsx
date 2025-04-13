"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserAnswer } from "@/hooks/useUserAnswer";
import { cn } from "@/lib/utils";
import { BarChart, CheckCircle, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { redirect } from "next/navigation";
import { toast } from "sonner";

type ReviewProps = {
  documentId: string;
  historyId: string;
};

export default function Review({ documentId, historyId }: ReviewProps) {
  const t = useTranslations("history");
  const isMobile = useIsMobile();

  const {
    historyRecord,
    isLoading: historyLoading,
    isError: isHistoryError,
    error: historyError,
    isSuccess: historySuccess,
  } = useUserAnswer(documentId, historyId);

  console.log({ historyRecord });

  if (isHistoryError) {
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
      {historyLoading ? (
        <Card className="w-full max-w-4xl shadow-lg">
          <CardHeader className="flex flex-col space-y-6">
            <CardTitle>
              <div className="flex items-center">
                <div className="mr-2 rounded-sm bg-primary p-1">
                  <BarChart className="text-white" />
                </div>
                <p className={isMobile ? "text-sm" : ""}>
                  {t("performanceSummary")}
                </p>
                <Skeleton className="ml-5 h-5 w-14 rounded-full" />
              </div>
            </CardTitle>
            <div className="mb-2 w-full">
              <Skeleton className="h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-44 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-12 w-full" />
          </CardFooter>
        </Card>
      ) : historySuccess ? (
        <div className="flex w-full flex-col items-center justify-center space-y-4">
          <Card className="w-full max-w-4xl shadow-lg">
            <CardHeader className="rounded-t-md">
              <CardTitle>
                <div className="flex items-center">
                  <div className="mr-2 rounded-sm bg-primary p-1">
                    <BarChart className="text-white" />
                  </div>
                  <p>{t("performanceSummary")}</p>
                  <Badge className="ml-5">
                    {historyRecord.type.charAt(0).toUpperCase() +
                      historyRecord.type.slice(1).toLowerCase()}
                  </Badge>
                </div>
                <div className="mb-2 mt-6 flex items-center justify-between">
                  <span className="text-sm font-medium">{t("score")}</span>
                  <span className="text-2xl font-bold">
                    {historyRecord.grade.toFixed(0)}
                  </span>
                </div>
                <Progress value={historyRecord.grade} className="h-2" />
              </CardTitle>
            </CardHeader>

            <CardContent className="mt-3 space-y-6">
              {historyRecord.QuestionHistory.map((data, idx) => (
                <div className="rounded-lg border px-6 pb-6 pt-4" key={idx}>
                  <div className="flex items-center justify-start">
                    <h2
                      className={cn(
                        "font-semibold",
                        isMobile ? "text-sm" : "text-lg",
                      )}
                    >
                      {idx + 1}. {data.question.question}
                    </h2>
                    {data.question.correctAnswer ===
                    historyRecord.AnswerHistory[idx].answer ? (
                      <CheckCircle
                        className={cn(
                          "ml-4 text-green-500",
                          isMobile ? "h-9 w-9" : "h-5 w-5",
                        )}
                      />
                    ) : (
                      <XCircle
                        className={cn(
                          "ml-4 text-red-500",
                          isMobile ? "h-9 w-9" : "h-6 w-6",
                        )}
                      />
                    )}
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {historyRecord.QuestionHistory[idx].question.options.map(
                      (option, index) => {
                        const userAnswer =
                          historyRecord.AnswerHistory[idx].answer;
                        const isCorrect =
                          option.text === data.question.correctAnswer;
                        const isUserAnswer = option.text === userAnswer;

                        return (
                          <div
                            key={index}
                            className={`h-auto w-full justify-start overflow-hidden whitespace-normal break-words rounded-md border px-2 py-6 text-left text-foreground transition-all ${isCorrect ? "bg-green-500" : ""} ${isUserAnswer && !isCorrect ? "bg-red-500" : ""} ${!isCorrect && !isUserAnswer ? "bg-background" : ""}`}
                          >
                            <span
                              className={`max-w-full text-sm ${isCorrect ? "font-semibold text-white" : ""} ${isUserAnswer && !isCorrect ? "font-semibold text-white" : ""}`}
                            >
                              {option.text}
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              ))}
            </CardContent>

            <CardFooter className="grid w-full max-w-4xl grid-cols-2 gap-4">
              <Link className="w-full" href="/dashboard/history">
                <Button variant="outline" className="w-full">
                  {t("viewHistoryBtn")}
                </Button>
              </Link>
              <Link
                className="w-full"
                href={`/dashboard/material/library/document/${documentId}/flashcard`}
              >
                <Button className="w-full">{t("viewFcBtn")}</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
