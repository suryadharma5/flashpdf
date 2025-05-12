import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FlashCardDataProps } from "@/hooks/useFlashcard";
import { cn } from "@/lib/utils";

import { Alert } from "@/components/dashboard/library/alert-dialog";
import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { EditFlashcardDialog } from "./edit-flashcard";

type FlashcardProps = {
  isFlipped: boolean;
  isMobile: boolean;
  currentCardIndex: number;
  isEditable: boolean;
  questions: FlashCardDataProps[];
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
  isEditable,
}: FlashcardProps) => {
  const currentCard = questions[currentCardIndex];

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [keyPoint, setKeyPoint] = useState(currentCard.keyPoint);
  const [explanation, setExplanation] = useState(currentCard.explanation);

  const t = useTranslations("flashcard");

  const handleEditFlashcard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };

  const handleDeleteFlashcard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const deleteFlashcardMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(
        `/api/material?type=flashcard&flashcardId=${currentCard.id}`,
      );
    },
    onSuccess: () => {
      toast.success("Flashcard deleted successfully");
      window.location.reload();
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete flashcard");
    },
  });
  return (
    <>
      <Card className="w-full max-w-4xl border-0 bg-white shadow-none">
        <CardContent className="px-0 py-6">
          <div className="mb-8 w-full">
            <div
              className={`${isMobile ? "h-[22rem]" : "mb-4 h-[28rem]"} w-full cursor-pointer [perspective:1000px]`}
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
                {isEditable && (
                  <div
                    className={cn(
                      "absolute right-2 top-2 z-10 flex gap-1 transition duration-150 ease-in-out",
                      isFlipped ? "hidden" : "",
                    )}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/90 hover:bg-white/70"
                      onClick={handleEditFlashcard}
                    >
                      <Edit className="h-7 w-7" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/90 hover:bg-white/70"
                      onClick={handleDeleteFlashcard}
                    >
                      <Trash2 className="h-7 w-7 text-destructive" />
                    </Button>
                  </div>
                )}
                <div className="absolute inset-0 flex w-full flex-col justify-center rounded-lg border border-gray-200 bg-white p-8 text-center shadow-lg [backface-visibility:hidden]">
                  <p
                    className={`${isMobile ? "text-xl" : "text-2xl"} font-semibold text-gray-800`}
                  >
                    {keyPoint}
                  </p>
                  <p
                    className={`mt-4 ${isMobile ? "text-sm" : "text-base"} text-gray-500`}
                  >
                    {t("tapToFlip")}
                  </p>
                </div>
                <div className="absolute inset-0 flex w-full flex-col justify-center rounded-lg border border-green-200 bg-green-100/25 p-8 text-center shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <p
                    className={`${isMobile ? "text-xl" : "text-2xl"} font-semibold text-gray-800`}
                  >
                    {explanation}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </CardContent>
        <CardFooter
          className={`${isMobile ? "" : "mt-4"} flex items-center justify-between px-0`}
        >
          <Button
            onClick={prevCard}
            variant="outline"
            size={isMobile ? "sm" : "lg"}
          >
            <ChevronLeft className={`${isMobile ? "" : "mr-2"} h-6 w-6`} />
            {isMobile ? "" : t("prevBtn")}
          </Button>
          <span className="font-medium text-gray-600">
            {currentCardIndex + 1} / {questions.length}
          </span>
          <Button
            onClick={nextCard}
            variant="outline"
            size={isMobile ? "sm" : "lg"}
          >
            {isMobile ? "" : t("nextBtn")}
            <ChevronRight className={`${isMobile ? "" : "ml-2"} h-6 w-6`} />
          </Button>
        </CardFooter>
      </Card>
      <EditFlashcardDialog
        id={currentCard.id}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        setKeyPoint={setKeyPoint}
        setExplanation={setExplanation}
        defaultValues={{
          keyPoint: keyPoint,
          explanation: explanation,
        }}
      />

      <Alert
        title="Apakah Anda yakin?"
        description="Flashcard akan dihapus permanen dan tidak bisa dikembalikan. Apakah Anda yakin ingin melanjutkan?"
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSubmit={() => {
          deleteFlashcardMutation.mutate();
        }}
      />
    </>
  );
};
