"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ChevronLeft, ChevronRight, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EnhancedPretestComponent() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(5).fill(null));
  const [testScore, setTestScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
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
  ];

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const handleAnswer = (index) => {
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
    const score = userAnswers.filter(
      (answer, index) => answer === mockQuestions[index].correctAnswer,
    ).length;
    setTestScore((score / mockQuestions.length) * 100);
    setIsSubmitted(true);
  };

  const handleViewFlashcards = () => {
    router.push("/flashcards");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-black">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="rounded-t-lg bg-black text-white">
          <CardTitle className="text-center text-2xl font-bold">
            {isSubmitted ? "Pretest Complete" : "Pretest"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {!isSubmitted ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {mockQuestions.length}
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <Timer className="mr-1 h-4 w-4" />
                  {formatTime(timeLeft)}
                </div>
              </div>
              <Progress
                value={((currentQuestion + 1) / mockQuestions.length) * 100}
                className="mb-6"
              />
              <h2 className="mb-4 text-xl font-semibold">
                {mockQuestions[currentQuestion].question}
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        ? "bg-black text-white hover:bg-gray-800"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="mb-4 text-center text-2xl font-bold">
                Your Score: {testScore.toFixed(2)}%
              </h2>
              <Progress value={testScore} className="mb-6 w-full" />
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Well done!</AlertTitle>
                <AlertDescription>
                  You've completed the pretest. Now you can proceed to the
                  flashcards to reinforce your learning.
                </AlertDescription>
              </Alert>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!isSubmitted ? (
            <>
              <Button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="bg-gray-200 text-black transition-colors hover:bg-gray-300 focus:ring-2 focus:ring-gray-300"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              {currentQuestion === mockQuestions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  className="bg-black text-white transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-gray-300"
                >
                  Submit
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-black text-white transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-gray-300"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </>
          ) : (
            <Button
              onClick={handleViewFlashcards}
              className="w-full bg-black text-white transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-gray-300"
            >
              View Flashcards
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
