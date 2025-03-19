"use client";

import { Empty } from "@/components/dashboard/empty";
import ErrorPage from "@/components/dashboard/error";
import { FilterSearch } from "@/components/dashboard/filtersearch";
import Comment, { ForumProps } from "@/components/dashboard/forum/comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { axiosInstance } from "@/lib/axios";
import { categoryColors } from "@/lib/util/category";
import EmptyImage from "@/public/Chill-Time.svg";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import { ArrowUpRight, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type PaginatedForumProps = {
  forums: ForumProps[];
  totalEntries: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type InfiniteQueryDataProps = {
  pageParams: number[];
  pages: PaginatedForumProps[];
};

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const observerTarget = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const fetchForums = async ({ pageParam }: { pageParam: number }) => {
    let url = `/api/forum?limit=5&page=${pageParam}`;

    if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
      url = url.concat(`&query=${debouncedSearchQuery}`);
    }

    if (selectedCategory) {
      url = url.concat(`&category=${selectedCategory}`);
    }

    const res = await axiosInstance.get(url);

    return res.data.data as PaginatedForumProps;
  };

  const { data, isError, isPending, isFetching, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["fetchForum", debouncedSearchQuery, selectedCategory],
      queryFn: fetchForums,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.hasNext) {
          const nextPage = pages.length + 1;
          return nextPage;
        }
        return undefined;
      },
      initialPageParam: 1,
      enabled: debouncedSearchQuery === "" || debouncedSearchQuery.length >= 3,
    });

  const paginatedData: PaginatedForumProps | undefined = data
    ? {
        forums: data.pages.flatMap((page) => page.forums), // Gabungkan semua forum dari setiap halaman
        totalEntries: data.pages[0]?.totalEntries ?? 0, // Ambil totalEntries dari halaman pertama
        totalPages: data.pages[0]?.totalPages ?? 0, // Ambil totalPages dari halaman pertama
        hasNext: data.pages[data.pages.length - 1]?.hasNext ?? false, // hasNext dari halaman terakhir
        hasPrev: data.pages[0]?.hasPrev ?? false, // hasPrev dari halaman pertama
      }
    : undefined;

  const forums = paginatedData?.forums ?? [];

  const likeMutation = useMutation({
    mutationFn: async (forumId: string) => {
      const res = await axiosInstance.patch(`/api/forum/${forumId}/like`);

      return res.data;
    },
    onMutate: async (forumId) => {
      await queryClient.cancelQueries({
        queryKey: ["fetchForum", debouncedSearchQuery, selectedCategory],
      });

      const previousData = queryClient.getQueryData<InfiniteQueryDataProps>([
        "fetchForum",
        debouncedSearchQuery,
      ]);

      queryClient.setQueryData(
        ["fetchForum", debouncedSearchQuery],
        (oldForums: InfiniteQueryDataProps | undefined) => {
          if (!oldForums) return { pageParams: [], pages: [] };

          return {
            ...oldForums,
            pages: oldForums.pages.map((page) => ({
              ...page,
              forums: page.forums.map((forum) =>
                forum.id === forumId
                  ? {
                      ...forum,
                      isLiked: !forum.isLiked,
                      totalLike: forum.isLiked
                        ? forum.totalLike - 1
                        : forum.totalLike + 1,
                    }
                  : forum,
              ),
            })),
          };
        },
      );

      return { previousData };
    },
    onSuccess: (data, forumId) => {
      queryClient.setQueryData(
        ["fetchForum", debouncedSearchQuery],
        (oldForums: InfiniteQueryDataProps | undefined) => {
          if (!oldForums || !oldForums.pages) {
            return { pageParams: [], pages: [] };
          }

          return {
            ...oldForums,
            pages: oldForums.pages.map((page) => ({
              ...page,
              forums: page.forums.map((forum) =>
                forum.id === forumId
                  ? {
                      ...forum,
                      totalLike: data.totalLike,
                      isLiked: forum.isLiked,
                    }
                  : forum,
              ),
            })),
          };
        },
      );
    },
    onError: (error, _forumId, context) => {
      console.log("fail", error);

      if (context?.previousData) {
        queryClient.setQueryData(
          ["fetchForum", debouncedSearchQuery],
          context.previousData,
        );
      }
    },
  });

  useEffect(() => {
    // Create the observer
    const observer = new IntersectionObserver(
      async (entries) => {
        // If the target element is visible and we have more data to load
        if (
          entries[0].isIntersecting &&
          paginatedData?.hasNext &&
          !isPending &&
          !isFetching
        ) {
          // Load the next page
          await fetchNextPage();
        }
      },
      { threshold: 0.1 }, // Trigger when at least 10% of the target is visible
    );

    // Start observing the target element
    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    // Clean up the observer when the component unmounts
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [paginatedData?.hasNext, isPending, isFetching]);

  useEffect(() => {
    console.log("executing");
    const handler = setTimeout(() => {
      if (searchQuery.length >= 3 || searchQuery === "") {
        setDebouncedSearchQuery(searchQuery);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="container mx-auto flex max-w-7xl flex-col items-start p-4">
      <h1 className="mb-8 w-full text-start text-3xl font-bold">
        Flashcards Forum
      </h1>

      <div className="w-full max-w-4xl">
        <FilterSearch
          searchTerm={searchQuery}
          setSearchTerm={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          placeHolder="Search forums..."
        />
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {isPending ? (
          <Card className="h-[45vh] w-full">
            <CardHeader className="flex flex-row space-x-5">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="w-full space-y-2">
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-44 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-12 w-full" />
            </CardFooter>
          </Card>
        ) : (
          <>
            {forums ? (
              <div className="w-full">
                {forums.length > 0 ? (
                  <div className="space-y-6">
                    {forums.map((post, idx) => (
                      <Card key={idx} className="w-full">
                        <CardHeader
                          className={`flex ${isMobile ? "flex-col space-y-2" : "flex-row items-center space-y-0"} justify-between pb-2`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8 rounded-full">
                                <AvatarImage
                                  src={post.user.image}
                                  alt={post.user.username}
                                />
                                <AvatarFallback className="rounded-full">
                                  {post.user.username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <CardTitle className="text-sm font-semibold">
                                {post.user.username}
                              </CardTitle>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              •
                            </span>
                            <small className="text-xs text-muted-foreground">
                              {formatDistanceToNowStrict(
                                new Date(post.createdAt),
                              )}{" "}
                              ago
                            </small>
                          </div>
                          <Badge
                            className={`border-2 border-${categoryColors[post.document.Category.name]} w-fit`}
                            variant={"outline"}
                          >
                            {post.document.Category.name.replace(
                              post.document.Category.name.charAt(0),
                              post.document.Category.name
                                .charAt(0)
                                .toUpperCase(),
                            )}
                          </Badge>
                        </CardHeader>
                        <CardContent className="py-2">
                          <Link
                            href={`/dashboard/forum/${post.documentId}/flashcard`}
                            className="group flex items-start space-x-2 rounded-md bg-gray-400/5 p-2 transition-colors hover:bg-secondary"
                          >
                            <div className="flex-grow">
                              <div className="flex items-center justify-between">
                                <h3 className="text-base font-medium transition-colors group-hover:text-primary">
                                  {post.title.replace(
                                    post.title.charAt(0),
                                    post.title.charAt(0).toUpperCase(),
                                  )}
                                </h3>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {post.description}
                              </p>
                            </div>
                          </Link>
                        </CardContent>
                        <CardFooter className="flex justify-between py-2">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground"
                              onClick={() => likeMutation.mutate(post.id)}
                              disabled={likeMutation.isPending}
                            >
                              {post.isLiked ? (
                                <Heart
                                  className="mr-2 h-4 w-4"
                                  fill="#c20f10"
                                  color="#c20f10"
                                />
                              ) : (
                                <Heart className="mr-2 h-4 w-4" />
                              )}
                              {post.totalLike}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground"
                            >
                              <MessageCircle className="mr-2 h-4 w-4" />
                              {post.comments.length}
                            </Button>
                          </div>
                        </CardFooter>
                        <Comment
                          forumId={post.id}
                          queryClient={queryClient}
                          key={post.id}
                          searchQuery={debouncedSearchQuery}
                          selectedCategory={selectedCategory}
                        />
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div>
                    <Empty
                      image={EmptyImage}
                      description="Post not found"
                      isActionButtonNeeded={false}
                    />
                  </div>
                )}
              </div>
            ) : (
              <Empty
                description="There are no forum available"
                isActionButtonNeeded={false}
                image={EmptyImage}
              />
            )}
          </>
        )}

        {isFetching && !isPending && (
          <Card className="w-full">
            <CardHeader className="flex flex-row space-x-5">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="w-full space-y-2">
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        )}

        {/* This is the target element for the IntersectionObserver */}
        <div ref={observerTarget} className="h-10 w-full" />

        {/* Show a message when there are no more posts */}
        {!paginatedData?.hasNext && forums.length > 0 && (
          <p className="py-4 text-center text-muted-foreground">
            No more posts to load
          </p>
        )}
      </div>
    </div>
  );
}
