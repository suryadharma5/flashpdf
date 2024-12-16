"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useQuestions } from "@/hooks/useQuestion";
import { axiosInstance } from "@/lib/axios";
import { TTestTypeEnum, TUploadHistorySchema } from "@/lib/types/question-form";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Flag, HelpCircle } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoFlagSharp } from "react-icons/io5";
import { toast } from "sonner";
import { LoadingPage } from "../../loading";
import { QuestionNavigator } from "./question-navigator";

type PretestProps = {
  documentId: string;
};

export default function Pretest({ documentId }: PretestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [userAnswers, setUserAnswers] = useState(Array(0).fill(null));

  const user = useCurrentUser();
  const router = useRouter();

  const handleAnswer = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitAnswer = useMutation({
    mutationFn: async (data: TUploadHistorySchema) => {
      const res = await axiosInstance.post("/api/material/history", {
        data: data,
      });

      return res.data;
    },

    onSuccess: (data) => {
      router.push(
        `/dashboard/history/document/${documentId}/review/${data.data.id}`,
      );
    },

    onError: (e) => {
      console.log(e);
    },
  });

  const handleSubmit = () => {
    const unansweredQuestions = userAnswers.filter(
      (answer) => answer === null,
    ).length;

    if (unansweredQuestions > 0) {
      toast.error(
        `You have ${unansweredQuestions} unanswered question${unansweredQuestions > 1 ? "s" : ""}. Please answer all questions before submitting.`,
        {
          duration: 3000,
        },
      );

      return;
    }

    const score = userAnswers.filter(
      (answer, index) => answer === questions[index].correctAnswer,
    ).length;

    const processedAnswers = userAnswers.map((answer) => ({
      answer: answer,
      userId: user.id,
    }));

    const uploadHistoryData = {
      history: {
        grade: (score / questions.length) * 100,
        type: "PRETEST" as TTestTypeEnum,
        userId: user.id,
        documentId: documentId,
      },
      answers: processedAnswers,
    };

    submitAnswer.mutate({
      history: uploadHistoryData.history,
      answers: uploadHistoryData.answers,
    });
  };

  const toggleFlaggedQuestion = (index: number) => {
    setFlaggedQuestions((prevFlagged) => {
      const newFlagged = new Set(prevFlagged);
      if (newFlagged.has(index)) {
        newFlagged.delete(index);
        toast.info(`Question ${index + 1} unflagged`);
      } else {
        newFlagged.add(index);
        toast.info(`Question ${index + 1} flagged for review`);
      }
      return newFlagged;
    });
  };

  const { questions, isError, isLoading, error, isSuccess } =
    useQuestions(documentId);

  if (isError) {
    console.error(error);

    setTimeout(() => {
      redirect("/dashboard/home");
    }, 3000);

    toast.error("Oops, something went wrong.\n Redirecting to home page", {
      duration: 3000,
    });
  }

  useEffect(() => {
    if (questions.length > 0 && userAnswers.length === 0) {
      setUserAnswers(Array(questions.length).fill(null));
    }
  }, [questions]);

  if (submitAnswer.isPending) {
    return <LoadingPage />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-start justify-center space-y-4 bg-background p-4 text-foreground md:flex-row md:space-x-4 md:space-y-0">
      {isLoading ? (
        <LoadingPage />
      ) : isSuccess && questions.length > 0 ? (
        <>
          <QuestionNavigator
            mockQuestions={questions}
            currentQuestion={currentQuestion}
            setCurrentQuestion={(index) => setCurrentQuestion(index)}
            userAnswers={userAnswers}
            flaggedQuestions={flaggedQuestions}
          />

          <Card className="w-full max-w-4xl shadow-lg">
            <CardHeader className="rounded-t-md">
              <CardTitle className="text-start font-bold">
                <div>
                  Pretest Questions
                  <div className="mb-4 flex items-center justify-between font-normal">
                    <div className="mt-2 flex items-center space-x-2">
                      <small className="text-xs text-muted-foreground">
                        Question {currentQuestion + 1} of {questions.length}
                      </small>
                    </div>
                  </div>
                  <Progress
                    value={((currentQuestion + 1) / questions.length) * 100}
                    className="mb-6"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6">
              {questions && (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      {questions[currentQuestion]?.question}
                    </h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              toggleFlaggedQuestion(currentQuestion)
                            }
                          >
                            {flaggedQuestions.has(currentQuestion) ? (
                              <IoFlagSharp color="red" />
                            ) : (
                              <Flag />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {flaggedQuestions.has(currentQuestion)
                              ? "Unflag"
                              : "Flag"}{" "}
                            this question
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {questions[currentQuestion]?.options.map(
                      (option, index) => (
                        <Button
                          key={index}
                          onClick={() => handleAnswer(option)}
                          variant={
                            userAnswers[currentQuestion] === option
                              ? "default"
                              : "outline"
                          }
                          className={`h-auto w-full justify-start py-6 text-left transition-all ${
                            userAnswers[currentQuestion] === option
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                          } overflow-hidden whitespace-normal break-words`}
                        >
                          <span className="max-w-full font-medium">
                            {option}
                          </span>
                        </Button>
                      ),
                    )}
                  </div>
                  <Separator className="my-6" />
                  <div className="flex items-center justify-between">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <HelpCircle className="mr-2 h-4 w-4" />
                          Help
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Test Instructions</DialogTitle>
                          <div className="text-sm text-muted-foreground">
                            <ul className="mt-3 list-disc space-y-2 pl-4">
                              <li>
                                Read each question carefully before answering.
                              </li>
                              <li>You can flag questions to review later.</li>
                              <li>
                                Use the Previous and Next buttons to navigate.
                              </li>
                              <li>
                                You must answer all questions before submitting.
                              </li>
                              <li>Click Submit when you're done.</li>
                            </ul>
                          </div>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <p className="text-sm text-muted-foreground">
                      {userAnswers.filter((answer) => answer !== null).length}{" "}
                      of {questions.length} answered
                    </p>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <>
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  variant="outline"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                {currentQuestion === questions.length - 1 ? (
                  <Button onClick={handleSubmit}>Submit</Button>
                ) : (
                  <Button onClick={handleNext}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </>
            </CardFooter>
          </Card>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}
