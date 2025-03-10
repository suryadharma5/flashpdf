"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PlaceHolderImage from "@/public/placeholder.svg";
import { BookmarkPlus, Plus, Sun, Moon, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Forum, Question } from "@prisma/client";


export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const user = useCurrentUser();
  const username = user.username ? user.username : user.name;

  type ForumProps = {
    id: string;
    title: string;
    description: string;
    documentId: string;
    user: {
      username: string;
      image: string;
    };
    createdAt: string;
    totalLike: number;
    likes: [
      {
        id: string;
      },
    ];
    isLiked: boolean;
    comments: [
      {
        id: string;
      },
    ];
    document: {
      Category: {
        name: string;
      };
    };
  };

  type HistoryProps = {
    type: string;
  };

  type DocumentProps = {
    id: string;
    createdAt: string;
    title: string;
    isPublic: boolean;
    questions: Question[];
    History: HistoryProps[];
    Forum: Forum[];
    Category?: {
      name: string;
    };
  };

  const {
      data: posts,
      isError,
      isPending: isForumPending,
    } = useQuery({
      queryKey: ["fetchForum"],
      queryFn: async () => {
        const res = await axiosInstance.get("/api/forum");
        return res.data.data as ForumProps[];
      },
    });

    const {
        data: documents,
        isError: isDocumentError,
        isPending: isDocumentPending,
      } = useQuery({
        queryKey: ["fetchDocument"],
        queryFn: async () => {
          const res = await axiosInstance.get("/api/material");
          return res.data.data as DocumentProps[];
        },
      });

      const isPostTestComplete = (histories: HistoryProps[]) =>
        histories.some((history) => history.type.toLowerCase() === "posttest");

  return (
    
    <main className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="mx-auto px-4 py-8 xl:max-w-5xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-black">
          Welcome back, {username}!
        </h1>
        <h2 className="mb-4 text-center text-xl font-semibold">
          What would you like to learn today?
        </h2>

        <Link href="/dashboard/material/create">
          <Button
            variant="outline"
            className="mb-12 w-full border-gray-300 py-6 text-gray-600 hover:bg-gray-100 hover:text-black"
          >
            <Plus className="mr-2 h-5 w-5" />
            Generate Flashcard
          </Button>
        </Link>

        <div className="space-y-12">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Flashcard Created</h2>
              <Link href="/dashboard/material/library">
              <Button variant="link" className="text-gray-600 hover:text-black">
                View all
              </Button>
              </Link>
            </div>
            {isDocumentPending ? (
              <p>Loading...</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {documents?.slice(0, 4).map((doc) => (
                  <Card key={doc.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{doc.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary" className="mb-2">
                        {doc?.Category?.name || "Uncategorized"}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        Created on: {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                    <div className="flex w-full flex-col gap-2">
                          <Link
                            className="w-full"
                            href={`/dashboard/material/library/document/${doc.id}/flashcard`}
                          >
                            <Button
                              size="sm"
                              className="w-full"
                              disabled={doc.History.length <= 0}
                            >
                              View Flashcards
                            </Button>
                          </Link>
                          {doc.History.length > 0 ? (
                            <Link
                              href={`/dashboard/material/library/document/${doc.id}/posttest`}
                              className="w-full"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                {isPostTestComplete(doc.History)
                                  ? "Retake Post-test"
                                  : "Take Post-test"}
                              </Button>
                            </Link>
                          ) : (
                            <Link
                              href={`/dashboard/material/library/document/${doc.id}/pretest`}
                              className="w-full"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                Take Pre-test
                              </Button>
                            </Link>
                          )}
                        </div>
                      </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Trending Flashcard Forum</h2>
              <Link href={`/dashboard/forum`}>
              <Button variant="link" className="text-gray-600 hover:text-black">
                View all
              </Button>
              </Link>
            </div>
            {isForumPending ? (
              <p>Loading...</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {posts
                  ?.sort((a, b) => b.totalLike - a.totalLike)
                  .slice(0, 4)
                  .map((post) => (
                    <Card key={post.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="secondary" className="mb-2">
                          {post.document?.Category?.name || "Uncategorized"}
                        </Badge>
                        <p className="text-sm text-gray-600">
                          Created by: {post.user.username}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <div className="flex items-center text-gray-600">
                          <Heart className="w-4 h-4 text-red-500 mr-1" />
                          <span>{post.totalLike}</span>
                        </div>
                        <Button variant="outline">
                          <BookmarkPlus className="mr-2 h-4 w-4" />
                          Save Flashcard
                        </Button>
                      </CardFooter>
                    </Card>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
