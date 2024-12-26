import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { QuestionProps } from "@/hooks/useQuestion";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type FlashcardProps = {
  isFlipped: boolean;
  isMobile: boolean;
  currentCardIndex: number;
  questions: QuestionProps[];
  flipCard: () => void;
  prevCard: () => void;
  nextCard: () => void;
};

export const Flashcard = ({
  isFlipped,
  isMobile,
  currentCardIndex,
  flipCard,
  nextCard,
  prevCard,
  questions,
}: FlashcardProps) => {
  const currentCard = questions[currentCardIndex];

  return (
    <Card className="w-full max-w-4xl border-0 bg-white shadow-none">
      <CardContent className="px-0 py-6">
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
      <CardFooter className="mt-4 flex items-center justify-between px-0">
        <Button
          onClick={prevCard}
          variant="outline"
          size={isMobile ? "sm" : "lg"}
        >
          <ChevronLeft className="mr-2 h-6 w-6" />
          Previous
        </Button>
        <span className="font-medium text-gray-600">
          {currentCardIndex + 1} / {questions.length}
        </span>
        <Button
          onClick={nextCard}
          variant="outline"
          size={isMobile ? "sm" : "lg"}
        >
          Next
          <ChevronRight className="ml-2 h-6 w-6" />
        </Button>
      </CardFooter>
    </Card>
  );
};
