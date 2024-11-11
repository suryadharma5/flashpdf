"use client";

import { InputModal } from "@/components/dashboard/material/input-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useSidebar } from "@/hooks/useSidebar";
import PlaceHolderImage from "@/public/placeholder.svg";
import { BookmarkPlus, ChevronsRight, LogOut, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function MaterialPage() {
  const { isOpen: isSidebarOpen, toggleSidebar } = useSidebar();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState<boolean>(false);

  const flashcards = [
    {
      id: 1,
      title: "Photosynthesis Process",
      topic: "Natural Science",
      creator: "BiologyFan101",
    },
    {
      id: 2,
      title: "World War II Key Events",
      topic: "Social Science",
      creator: "HistoryBuff22",
    },
    {
      id: 3,
      title: "Basic Algebra Concepts",
      topic: "Science",
      creator: "MathWhiz99",
    },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex items-center justify-between bg-white p-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleSidebar(isSidebarOpen)}
            className={`text-black hover:bg-gray-100 ${isSidebarOpen ? "hidden" : "flex"} mr-2 justify-center`}
          >
            <ChevronsRight className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">FlashAI</h1>
        </div>
        <Button variant="default" className="text-white hover:text-gray-400">
          <LogOut className="mr-1 h-3 w-3" />
          Log out
        </Button>
      </header>
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto px-4 py-8 xl:max-w-5xl">
          <h1 className="mb-8 text-center text-4xl font-bold text-black">
            What do you want to learn today?
          </h1>

          <Button
            variant="outline"
            className="mb-12 w-full border-gray-300 py-6 text-gray-600 hover:bg-gray-100 hover:text-black"
            onClick={() => setIsUploadDialogOpen(true)}
          >
            <Plus className="mr-2 h-5 w-5" />
            Upload PDF
          </Button>

          <InputModal
            title="Upload PDF"
            buttonTitle="Generate FlashCard"
            isDialogOpen={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
          />

          <div className="space-y-12">
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Continue learning</h2>
                <Button
                  variant="link"
                  className="text-gray-600 hover:text-black"
                >
                  View all
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
                  <Image
                    src={PlaceHolderImage}
                    alt="Nextjs Project Management"
                    width={400}
                    height={200}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">
                      Build a Nextjs Project Management...
                    </h3>
                  </div>
                </div>
                <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
                  <Image
                    src={PlaceHolderImage}
                    alt="Kafka Use Cases"
                    width={400}
                    height={200}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">
                      Top Kafka Use Cases You Should K...
                    </h3>
                  </div>
                </div>
              </div>
            </>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Explore flashcards</h2>
                <Button
                  variant="link"
                  className="text-gray-600 hover:text-black"
                >
                  View all
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {flashcards.map((flashcard) => (
                  <Card key={flashcard.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {flashcard.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary" className="mb-2">
                        {flashcard.topic}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        Created by: {flashcard.creator}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <BookmarkPlus className="mr-2 h-4 w-4" />
                        Save Flashcard
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
