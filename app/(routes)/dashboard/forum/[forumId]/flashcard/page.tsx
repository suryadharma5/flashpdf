"use client";

import ErrorPage from "@/components/dashboard/error";
import { LoadingPage } from "@/components/dashboard/loading";
import { Flashcard } from "@/components/dashboard/material/flashcard/flashcard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFlashcard } from "@/hooks/useFlashcard";
import { axiosInstance } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "use-intl";

type ForumPreviewProps = {
  forumId: string;
};

type SavedDocumentProps = {
  documentId: string;
  userId: string;
};

export default function ForumPreview() {
  const params: ForumPreviewProps = useParams();
  const queryClient = useQueryClient();
  const t = useTranslations("forum");

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const user = useCurrentUser();

  const isMobile = useIsMobile();
  const { flashcardsData, isLoading, isError, documentId, userId } =
    useFlashcard(params.forumId);

  const nextCard = useCallback(() => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcardsData.length);
    setIsFlipped(false);
  }, [flashcardsData]);

  const prevCard = useCallback(() => {
    setCurrentCardIndex(
      (prevIndex) =>
        (prevIndex - 1 + flashcardsData.length) % flashcardsData.length,
    );
    setIsFlipped(false);
  }, [flashcardsData]);

  const flipCard = () => setIsFlipped(!isFlipped);

  const {
    data: savedData,
    isPending,
    isError: fetchSavedDocumentError,
  } = useQuery({
    queryKey: ["fetchSavedDocument", params.forumId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/save?documentId=${documentId}`);

      return res.data.data;
    },
  });

  const saveDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const res = await axiosInstance.post(
        `/api/save?documentId=${documentId}`,
      );

      return res.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["fetchSavedDocument", params.forumId],
      });

      const previousData = queryClient.getQueryData<SavedDocumentProps | null>([
        "fetchSavedDocument",
        params.forumId,
      ]);

      queryClient.setQueryData(
        ["fetchSavedDocument", params.forumId],
        (prevData: SavedDocumentProps | null) => {
          if (prevData === null)
            return {
              documentId: documentId,
              userId: user?.id,
            };
          return null;
        },
      );

      return { previousData, documentId };
    },
    onSuccess: (_data, _, context) => {
      toast.success(
        context.previousData != null
          ? t("unsaveFlashcard")
          : t("saveFlashcard"),
        {
          duration: 3000,
        },
      );
    },
    onError: (error) => {
      console.error(error);
    },
  });

  if (isLoading || isPending) {
    return <LoadingPage />;
  }

  if (isError || fetchSavedDocumentError) {
    return <ErrorPage />;
  }

  return (
    <div className="-mt-12 flex h-[90vh] max-h-screen w-full flex-col items-center justify-center space-y-4 p-4">
      <Card className="w-full max-w-4xl border-none shadow-none">
        <CardHeader className={cn("px-0 py-6", isMobile && "px-0")}>
          <div className="w-full">
            <div className="w-full [perspective:1000px]">
              <div className="absolute inset-0 flex w-full flex-col justify-center rounded-lg border-none text-center">
                <div
                  className={`flex items-center ${isMobile ? "gap-2" : "gap-4"}`}
                >
                  <Link href="/dashboard/forum">
                    <Button variant="ghost" size={"icon"}>
                      <ChevronLeft className="h-7 w-7" />
                    </Button>
                  </Link>
                  <div className="flex w-full items-center justify-between">
                    <h1
                      className={`text-start ${isMobile ? "text-base" : "text-2xl"} font-semibold text-gray-800`}
                    >
                      Review Flashcards
                    </h1>
                    {user?.id !== userId && (
                      <Button
                        size={isMobile ? "icon" : "default"}
                        variant={savedData !== null ? "default" : "outline"}
                        onClick={() => saveDocumentMutation.mutate(documentId)}
                        className={
                          savedData !== null
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : ""
                        }
                      >
                        <Bookmark
                          className={`h-5 w-5 ${savedData !== null ? "fill-current" : ""}`}
                        />
                        {!isMobile && (
                          <p>Save{savedData !== null ? "d" : ""}</p>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Flashcard
        currentCardIndex={currentCardIndex}
        isMobile={isMobile}
        isFlipped={isFlipped}
        flipCard={flipCard}
        nextCard={nextCard}
        prevCard={prevCard}
        questions={flashcardsData}
        isEditable={false}
      />
    </div>
  );
}
