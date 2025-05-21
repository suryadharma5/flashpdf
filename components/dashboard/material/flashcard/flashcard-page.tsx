"use client";

import { ChatDialog } from "@/components/chat/chat-dialog";
import { LoadingPage } from "@/components/dashboard/loading";
import Tiptap from "@/components/dashboard/material/flashcard/tiptap";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFlashcard } from "@/hooks/useFlashcard";
import { axiosInstance } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useChat } from "ai/react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Flashcard } from "./flashcard";

type FlashcardProps = {
  id: string;
};

const FlashcardPage = ({ id }: FlashcardProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const isMobile = useIsMobile();

  const { flashcardsData, isError, isLoading, error, namespace, userId } =
    useFlashcard(id);

  const {
    data,
    isLoading: chatRetrieveLoading,
    isError: isChatError,
    error: chatError,
  } = useQuery({
    queryKey: ["fetchChat", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/chat?documentId=${id}`);
      return res.data.data;
    },
  });

  const {
    messages,
    handleSubmit,
    input,
    setInput,
    isLoading: aiLoading,
    stop,
    error: aiError,
  } = useChat({
    id,
    initialMessages: data?.messages ?? [],
    body: {
      documentId: id,
      namespace,
    },
    onFinish: () => {
      console.log("Finish");
    },
  });

  const flipCard = () => setIsFlipped(!isFlipped);
  const user = useCurrentUser();
  const isEditable = user?.id === userId;

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

  if (isLoading || chatRetrieveLoading) {
    return <LoadingPage />;
  }

  if (isError || isChatError) {
    console.log({ error });
    console.log({ chatError });
  }

  if (aiError) {
    console.error({ aiError });
    toast.error("Something went wrong!", {
      duration: 3000,
      position: "top-right",
    });
  }

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4">
      <Card className="w-full max-w-4xl border-0 shadow-none">
        <CardHeader className={cn("px-0 py-6", isMobile && "px-0")}>
          <div className="w-full">
            <div className="w-full [perspective:1000px]">
              <div className="absolute inset-0 flex w-full flex-col justify-center rounded-lg border-none text-center">
                <div
                  className={`flex items-center ${isMobile ? "gap-2" : "gap-4"}`}
                >
                  <Link href="/dashboard/material/library">
                    <Button variant="ghost" size={"icon"}>
                      <ChevronLeft className="h-7 w-7" />
                    </Button>
                  </Link>
                  <div className="flex w-full items-center justify-between">
                    <h1
                      className={`text-start ${isMobile ? "text-xl" : "text-2xl"} font-semibold text-gray-800`}
                    >
                      Review Flashcards
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="flashcard" className="w-full max-w-[53rem]">
        <TabsList className="grid w-full grid-cols-2 rounded-md bg-white">
          <TabsTrigger value="flashcard">Flashcard</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="flashcard">
          <Flashcard
            currentCardIndex={currentCardIndex}
            isMobile={isMobile}
            isFlipped={isFlipped}
            flipCard={flipCard}
            nextCard={nextCard}
            prevCard={prevCard}
            questions={flashcardsData}
            isEditable={isEditable}
          />
        </TabsContent>

        <TabsContent value="notes">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-4xl">
              <Tiptap documentId={id} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <ChatDialog
        handleSubmit={handleSubmit}
        input={input}
        isLoading={aiLoading}
        messages={messages}
        setInput={setInput}
        stop={stop}
      />
    </div>
  );
};

export default FlashcardPage;
