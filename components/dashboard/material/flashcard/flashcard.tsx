"use client";

import { LoadingPage } from "@/components/dashboard/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQuestions } from "@/hooks/useQuestion";
import { motion } from "framer-motion";
import { Bot, ChevronLeft, ChevronRight, Send, User } from "lucide-react";
import { useCallback, useState } from "react";

type FlashcardProps = {
  id: string;
};

const Flashcard = ({ id }: FlashcardProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [inputMessage, setInputMessage] = useState("");

  const { documentTitle, questions, isError, isLoading, error } =
    useQuestions(id);

  const flipCard = () => setIsFlipped(!isFlipped);

  const nextCard = useCallback(() => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % questions.length);
    setIsFlipped(false);
  }, [questions]);

  const prevCard = useCallback(() => {
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + questions.length) % questions.length,
    );
    setIsFlipped(false);
  }, [questions]);

  const currentCard = questions[currentCardIndex];

  const handleSendMessage = () => {
    setInputMessage("");
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    console.log({ error });
  }

  return (
    <div className="-mt-12 flex max-h-screen w-full flex-col items-center justify-center space-y-12 p-4">
      <Card className="w-full max-w-4xl border-0 bg-white shadow-none">
        <CardContent className="p-6">
          <div className="mb-8 w-full">
            <div className="mb-4 w-full [perspective:1000px]">
              <div className="absolute inset-0 flex w-full flex-col justify-center rounded-lg border border-gray-200 bg-white p-8 text-center shadow-md">
                <p className="text-start text-2xl font-semibold text-gray-800">
                  {documentTitle} Flashcards
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-4xl border-0 bg-white shadow-none">
        <CardContent className="p-6">
          <div className="mb-8 w-full">
            <div
              className="mb-4 h-96 w-full cursor-pointer [perspective:1000px]"
              onClick={flipCard}
              tabIndex={0}
              role="button"
              aria-pressed={isFlipped}
              aria-label={isFlipped ? "Show question" : "Show answer"}
            >
              <motion.div
                className="relative h-full w-full [transform-style:preserve-3d]"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 flex w-full flex-col justify-center rounded-lg border border-gray-200 bg-white p-8 text-center shadow-lg [backface-visibility:hidden]">
                  <p className="text-2xl font-semibold text-gray-800">
                    {currentCard.question}
                  </p>
                  <p className="mt-4 text-lg text-gray-500">
                    Click to see answer
                  </p>
                </div>
                <div className="absolute inset-0 flex w-full flex-col justify-center rounded-lg border border-green-200 bg-green-100/25 p-8 text-center shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <p className="text-2xl font-semibold text-gray-800">
                    {currentCard.correctAnswer}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-4 flex items-center justify-between">
          <Button onClick={prevCard} variant="outline" size="lg">
            <ChevronLeft className="mr-2 h-6 w-6" />
            Previous
          </Button>
          <span className="font-medium text-gray-600">
            {currentCardIndex + 1} / {questions.length}
          </span>
          <Button onClick={nextCard} variant="outline" size="lg">
            Next
            <ChevronRight className="ml-2 h-6 w-6" />
          </Button>
        </CardFooter>
      </Card>

      <Sheet>
        <SheetTrigger asChild>
          <div className="fixed bottom-7 right-7 rounded-full bg-primary p-4 text-white shadow-lg transition hover:scale-110 hover:cursor-pointer hover:bg-gray-700">
            <Bot className="h-7 w-7" />
          </div>
          {/* <Button className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg"></Button> */}
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg">
          <div className="flex h-full flex-col">
            <SheetTitle className="mb-4 text-2xl font-bold">Ask AI</SheetTitle>
            <ScrollArea className="mb-4 flex-grow">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <User className="mt-1 h-6 w-6 text-blue-500" />
                  <div className="flex-1 rounded-lg bg-blue-100 p-3">
                    <p className="text-sm text-blue-800">
                      Can you explain more about these flashcards?
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Bot className="mt-1 h-6 w-6 text-green-500" />
                  <div className="flex-1 rounded-lg bg-green-100 p-3">
                    <p className="text-sm text-green-800">
                      These flashcards cover a range of topics including
                      geography, literature, chemistry, and history. They're
                      designed to help you quickly review key facts. Is there a
                      specific card or topic you'd like to discuss further?
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <User className="mt-1 h-6 w-6 text-blue-500" />
                  <div className="flex-1 rounded-lg bg-blue-100 p-3">
                    <p className="text-sm text-blue-800">
                      Can you tell me more about the significance of the year
                      1945 in World War II?
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Bot className="mt-1 h-6 w-6 text-green-500" />
                  <div className="flex-1 rounded-lg bg-green-100 p-3">
                    <p className="text-sm text-green-800">
                      1945 marks the end of World War II. The war in Europe
                      ended in May 1945 with Germany's surrender, and the war in
                      the Pacific ended in August 1945 with Japan's surrender
                      following the atomic bombings of Hiroshima and Nagasaki.
                      This year signifies the conclusion of the deadliest
                      conflict in human history and the beginning of the
                      post-war era.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="mt-4 flex items-center">
              <Input
                type="text"
                placeholder="Type your message here..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={handleSendMessage} className="ml-2">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Flashcard;
