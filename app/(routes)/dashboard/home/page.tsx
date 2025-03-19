"use client";

import { ForumProps } from "@/components/dashboard/forum/comment";
import { LoadingPage } from "@/components/dashboard/loading";
import { SkeletonCard } from "@/components/dashboard/skeleton-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { axiosInstance } from "@/lib/axios";
import { categoryColors } from "@/lib/util/category";
import { Forum, Question } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import { BookOpen, Clock, Clock9, Flame, Heart } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

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

export default function HomePage() {
  const user = useCurrentUser();
  const username = user.username ? user.username : user.name;
  const isMobile = useIsMobile();

  const {
    data: posts,
    isError,
    isPending: isForumPending,
  } = useQuery({
    queryKey: ["fetchDashboardForum"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/forum?limit=3");
      return res.data.data as ForumProps[];
    },
  });

  const {
    data: documents,
    isError: isDocumentError,
    isPending: isDocumentPending,
  } = useQuery({
    queryKey: ["fetchDashboardDocument"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/material?limit=3");
      return res.data.data as DocumentProps[];
    },
  });

  const isPostTestComplete = (histories: HistoryProps[]) =>
    histories.some((history) => history.type.toLowerCase() === "posttest");

  const timeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  return (
    <Suspense fallback={<LoadingPage />}>
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto px-4 py-8 xl:max-w-5xl">
          <div className="space-y-10">
            <div className="mx-auto">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Welcome Card */}
                <Card className="col-span-1 border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm md:col-span-2">
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <h1 className="text-2xl font-medium text-gray-900">
                        Good {timeOfDay()},{" "}
                        <span className="font-bold">{username}</span>
                      </h1>
                      <p className="mt-2 text-muted-foreground">
                        What would you like to learn today?
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link href="/dashboard/material/create">
                        <Button
                          className="bg-black text-white hover:bg-gray-800"
                          size="lg"
                        >
                          Create Flashcard
                        </Button>
                      </Link>
                      <Link href="/dashboard/material/library">
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-gray-200"
                        >
                          Continue Learning
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>

                <Card className="border border-gray-100 p-6 shadow-sm">
                  <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">
                    Your Progress
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Cards Created</p>
                        <p className="text-xl font-semibold">
                          {isDocumentPending ? 0 : documents?.length}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Minutes Studied</p>
                        <p className="text-xl font-semibold">12 mins</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                        <Flame className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Current Streak</p>
                        <p className="text-xl font-semibold">{user.streak}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Flashcard</h2>
                <Link href="/dashboard/material/library">
                  <Button
                    variant="link"
                    className="text-gray-600 hover:text-black"
                  >
                    View all
                  </Button>
                </Link>
              </div>
              {isDocumentPending ? (
                <div
                  className={`grid w-full md:grid-cols-2 lg:grid-cols-3 ${isMobile ? "gap-4" : "gap-6"}`}
                >
                  {[...Array(3)].map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              ) : (
                documents &&
                (documents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {documents?.map((doc) => (
                      <Card key={doc.id}>
                        <CardHeader>
                          <Badge
                            variant={"default"}
                            className={`mb-1 w-fit border-2 ${categoryColors[doc.Category!.name] || "border-green-400"}`}
                          >
                            {doc?.Category?.name || "Uncategorized"}
                          </Badge>
                          <CardTitle className="text-lg">{doc.title}</CardTitle>
                          <div className="mt-2 flex items-center gap-1 text-muted-foreground">
                            <Clock9 size={15} />
                            <p className="text-xs">
                              {formatDistanceToNowStrict(doc.createdAt)} ago
                            </p>
                          </div>
                        </CardHeader>
                        <CardFooter className="flex items-center justify-between">
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
                ) : (
                  <Card className="p-5 text-center text-muted-foreground">
                    No documents have been created yet
                  </Card>
                ))
              )}
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Trending Flashcards</h2>
                <Link href={`/dashboard/forum`}>
                  <Button
                    variant="link"
                    className="text-gray-600 hover:text-black"
                  >
                    View all
                  </Button>
                </Link>
              </div>
              {isForumPending ? (
                <div
                  className={`grid w-full md:grid-cols-2 lg:grid-cols-3 ${isMobile ? "gap-4" : "gap-6"}`}
                >
                  {[...Array(3)].map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              ) : (
                posts &&
                (posts.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {posts.map((post) => (
                      <Card key={post.id}>
                        <CardHeader>
                          <Badge
                            variant={"default"}
                            className={`mb-1 w-fit ${categoryColors[post.document.Category?.name ?? "science"]}`}
                          >
                            {post.document?.Category?.name || "Uncategorized"}
                          </Badge>
                          <CardTitle className="text-lg">
                            {post.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Created by: {post.user.username}
                          </p>
                        </CardHeader>
                        <CardFooter className="flex items-center justify-between">
                          <div className="flex items-center text-gray-600">
                            <Heart className="mr-1 h-4 w-4 text-red-500" />
                            <span>{post.totalLike}</span>
                          </div>
                          <Link
                            href={`/dashboard/forum/${post.documentId}/flashcard`}
                          >
                            <Button>View Flashcards</Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-5 text-center text-muted-foreground">
                    No trending flashcards yet
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  );
}
