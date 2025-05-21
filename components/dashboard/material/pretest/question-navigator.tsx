"use client";

import { Alert } from "@/components/dashboard/library/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

type QuestionProps = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type QuestionNavigatorProps = {
  mockQuestions: QuestionProps[];
  currentQuestion: number;
  userAnswers: string[];
  setCurrentQuestion: (index: number) => void;
  flaggedQuestions: Set<any>;
};

export const QuestionNavigator = ({
  mockQuestions,
  currentQuestion,
  userAnswers,
  setCurrentQuestion,
  flaggedQuestions,
}: QuestionNavigatorProps) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [onSubmitAction, setOnSubmitAction] = useState<() => void>(
    () => () => {},
  );
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");

  const router = useRouter();
  const t = useTranslations("test");

  const showAlert = (
    title: string,
    description: string,
    onSubmit: () => void,
  ) => {
    setOnSubmitAction(() => onSubmit);
    setIsAlertOpen(true);
    setAlertTitle(title);
    setAlertDescription(description);
  };

  return (
    <Card className="mb-4 w-full shadow-lg md:mb-0 md:w-64">
      <CardHeader className="rounded-t-lg bg-primary text-primary-foreground">
        <CardTitle className="text-center text-xl font-bold">
          {t("navigatorTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-fit w-full rounded-md border px-2 py-4">
          <div className="grid grid-cols-5 justify-items-center gap-2 md:grid-cols-3">
            {mockQuestions.map((_, index) => (
              <Button
                key={index}
                variant={"outline"}
                className={`h-10 w-10 p-0 ${
                  userAnswers[index] !== null
                    ? "bg-primary text-primary-foreground"
                    : ""
                } ${
                  flaggedQuestions.has(index)
                    ? "border-2 border-destructive"
                    : ""
                } ${currentQuestion === index ? "border border-black" : ""}`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </ScrollArea>
        <Button
          size="lg"
          onClick={() =>
            showAlert(t("alertBackTitle"), t("alertBackMessage"), () =>
              router.back(),
            )
          }
          className="mt-4 w-full"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          {t("backBtn")}
        </Button>
      </CardContent>

      <Alert
        title={alertTitle}
        description={alertDescription}
        open={isAlertOpen}
        onOpenChange={(open) => setIsAlertOpen(open)}
        onSubmit={onSubmitAction}
      />
    </Card>
  );
};
