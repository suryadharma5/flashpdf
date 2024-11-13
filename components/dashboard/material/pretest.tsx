"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  ArrowLeft,
  BarChart,
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Flag,
  HelpCircle,
  RefreshCcw,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoFlagSharp } from "react-icons/io5";
import { toast } from "sonner";

export default function EnhancedPretestComponent() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(10).fill(null));
  const [testScore, setTestScore] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [showFullReview, setShowFullReview] = useState(false);
  const router = useRouter();

  const mockQuestions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2,
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Van Gogh", "Da Vinci", "Picasso", "Rembrandt"],
      correctAnswer: 1,
    },
    {
      question: "What is the largest planet in our solar system?",
      options: ["Mars", "Venus", "Jupiter", "Saturn"],
      correctAnswer: 2,
    },
    {
      question: "Which element has the chemical symbol 'O'?",
      options: ["Gold", "Silver", "Oxygen", "Iron"],
      correctAnswer: 2,
    },
    {
      question: "In which year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correctAnswer: 2,
    },
    {
      question: "What is the chemical formula for water?",
      options: ["H2O", "CO2", "NaCl", "CH4"],
      correctAnswer: 0,
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      options: [
        "Charles Dickens",
        "William Shakespeare",
        "Jane Austen",
        "Mark Twain",
      ],
      correctAnswer: 1,
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correctAnswer: 3,
    },
    {
      question: "What is the capital of Japan?",
      options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
      correctAnswer: 2,
    },
    {
      question: "In what year did the first moon landing occur?",
      options: ["1965", "1969", "1971", "1973"],
      correctAnswer: 1,
    },
  ];

  const handleAnswer = (index: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = index;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

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
      (answer, index) => answer === mockQuestions[index].correctAnswer,
    ).length;
    setTestScore((score / mockQuestions.length) * 100);
    setIsSubmitted(true);
    toast.success("Test submitted successfully!", {
      duration: 3000,
    });
  };

  const handleViewFlashcards = () => {
    router.push("/flashcards");
  };

  const handleRetakeTest = () => {
    setCurrentQuestion(0);
    setUserAnswers(Array(10).fill(null));
    setTestScore(null);
    setIsSubmitted(false);
    setFlaggedQuestions(new Set());
    setShowFullReview(false);
    toast.info("Test reset. Good luck!", { duration: 3000 });
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

  const getStatistics = () => {
    const totalQuestions = mockQuestions.length;
    const correctAnswers = userAnswers.filter(
      (answer, index) => answer === mockQuestions[index].correctAnswer,
    ).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const accuracy = (correctAnswers / totalQuestions) * 100;

    return {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      accuracy,
    };
  };

  const QuestionNavigator = () => (
    <Card className="mb-4 w-full shadow-lg md:mb-0 md:w-64">
      <CardHeader className="rounded-t-lg bg-primary text-primary-foreground">
        <CardTitle className="text-center text-xl font-bold">
          Question Navigator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-fit w-full rounded-md border px-2 py-4">
          <div className="grid grid-cols-5 justify-items-center gap-2 md:grid-cols-3">
            {mockQuestions.map((_, index) => (
              <Button
                key={index}
                variant={currentQuestion === index ? "secondary" : "outline"}
                className={`h-10 w-10 p-0 ${
                  userAnswers[index] !== null
                    ? "bg-primary text-primary-foreground"
                    : ""
                } ${
                  flaggedQuestions.has(index)
                    ? "border-2 border-destructive"
                    : ""
                }`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen w-full flex-col items-start justify-center space-y-4 bg-background p-4 text-foreground md:flex-row md:space-x-4 md:space-y-0">
      {!isSubmitted && <QuestionNavigator />}
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="rounded-t-lg bg-primary text-primary-foreground">
          <CardTitle className="text-center text-2xl font-bold">
            {!isSubmitted
              ? "Pretest Questions"
              : showFullReview
                ? "Full Test Review"
                : "Pretest Complete"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {!isSubmitted ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">
                    Question {currentQuestion + 1} of {mockQuestions.length}
                  </p>
                </div>
              </div>
              <Progress
                value={((currentQuestion + 1) / mockQuestions.length) * 100}
                className="mb-6"
              />
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {mockQuestions[currentQuestion].question}
                </h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleFlaggedQuestion(currentQuestion)}
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
                {mockQuestions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    variant={
                      userAnswers[currentQuestion] === index
                        ? "default"
                        : "outline"
                    }
                    className={`h-auto w-full justify-start py-6 text-left transition-all ${
                      userAnswers[currentQuestion] === index
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                  </Button>
                ))}
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
                      <DialogDescription>
                        <ul className="list-disc space-y-2 pl-4">
                          <li>
                            Read each question carefully before answering.
                          </li>
                          <li>You have 10 minutes to complete the test.</li>
                          <li>You can flag questions to review later.</li>
                          <li>
                            Use the Previous and Next buttons to navigate.
                          </li>
                          <li>
                            You must answer all questions before submitting.
                          </li>
                          <li>
                            Click Submit when you're done or when time runs out.
                          </li>
                        </ul>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <p className="text-sm text-muted-foreground">
                  {userAnswers.filter((answer) => answer !== null).length} of{" "}
                  {mockQuestions.length} answered
                </p>
              </div>
            </>
          ) : showFullReview ? (
            <div className="space-y-8">
              <Button
                onClick={() => setShowFullReview(false)}
                variant="outline"
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Results
              </Button>
              {mockQuestions.map((question, index) => (
                <Card key={index} className="w-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">
                      Question {index + 1}: {question.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`rounded-md p-4 ${
                            optionIndex === userAnswers[index] &&
                            optionIndex === question.correctAnswer
                              ? "border border-green-500 bg-green-100 dark:bg-green-900"
                              : optionIndex === userAnswers[index]
                                ? "border border-red-500 bg-red-100 dark:bg-red-900"
                                : optionIndex === question.correctAnswer
                                  ? "border border-green-500 bg-green-100 dark:bg-green-900"
                                  : "border border-border bg-white"
                          }`}
                        >
                          {option}
                          {optionIndex === userAnswers[index] && (
                            <Badge variant="secondary" className="ml-2">
                              Your answer
                            </Badge>
                          )}
                          {optionIndex === question.correctAnswer && (
                            <Badge variant="default" className="ml-2">
                              Correct answer
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h2 className="mb-2 text-3xl font-bold">
                  Your Score: {testScore?.toFixed(2)}%
                </h2>
                <p className="text-lg text-muted-foreground">
                  You answered{" "}
                  {
                    userAnswers.filter(
                      (answer, index) =>
                        answer === mockQuestions[index].correctAnswer,
                    ).length
                  }{" "}
                  out of {mockQuestions.length} questions correctly.
                </p>
              </div>
              <Progress value={testScore} className="mb-6 w-full" />
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Well done!</AlertTitle>
                <AlertDescription>
                  You've completed the pretest. Review your statistics below and
                  proceed to the flashcards to reinforce your learning.
                </AlertDescription>
              </Alert>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {(() => {
                      const stats = getStatistics();
                      return (
                        <>
                          <div className="flex flex-col items-center rounded-lg bg-green-100 p-4 dark:bg-green-900">
                            <CheckCircle className="mb-2 h-8 w-8 text-green-500" />
                            <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                              {stats.correctAnswers}
                            </span>
                            <span className="text-sm text-green-600 dark:text-green-400">
                              Correct Answers
                            </span>
                          </div>
                          <div className="flex flex-col items-center rounded-lg bg-red-100 p-4 dark:bg-red-900">
                            <XCircle className="mb-2 h-8 w-8 text-red-500" />
                            <span className="text-2xl font-bold text-red-700 dark:text-red-300">
                              {stats.incorrectAnswers}
                            </span>
                            <span className="text-sm text-red-600 dark:text-red-400">
                              Incorrect Answers
                            </span>
                          </div>
                          <div className="flex flex-col items-center rounded-lg bg-blue-100 p-4 dark:bg-blue-900">
                            <BarChart className="mb-2 h-8 w-8 text-blue-500" />
                            <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                              {stats.accuracy.toFixed(1)}%
                            </span>
                            <span className="text-sm text-blue-600 dark:text-blue-400">
                              Accuracy
                            </span>
                          </div>
                          <div className="flex flex-col items-center rounded-lg bg-purple-100 p-4 dark:bg-purple-900">
                            <Flag className="mb-2 h-8 w-8 text-purple-500" />
                            <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                              {flaggedQuestions.size}
                            </span>
                            <span className="text-sm text-purple-600 dark:text-purple-400">
                              Flagged Questions
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button onClick={handleViewFlashcards} className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Flashcards
                </Button>
                <Button
                  onClick={handleRetakeTest}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Retake Test
                </Button>
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="outline"
                  className="w-full"
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  View Dashboard
                </Button>
                <Button
                  onClick={() => setShowFullReview(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Review Full Test
                </Button>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!isSubmitted ? (
            <>
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                variant="outline"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              {currentQuestion === mockQuestions.length - 1 ? (
                <Button onClick={handleSubmit}>Submit</Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}
