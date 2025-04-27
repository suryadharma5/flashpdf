"use client";

import { InfiniteQueryDataProps } from "@/app/(routes)/dashboard/forum/page";
import { Alert } from "@/components/dashboard/library/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { axiosInstance } from "@/lib/axios";
import { commentSchema, TCommentSchema } from "@/lib/types/forum";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import { enUS, id } from "date-fns/locale";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export type ForumProps = {
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

type CommentProps = {
  id: string;
  comment: string;
  createdAt: string;
  user: {
    username: string;
    image: string;
    id: string;
  };
};

export default function Comment({
  forumId,
  queryClient,
  searchQuery,
  selectedCategory,
  selectedSort,
}: {
  forumId: string;
  queryClient: QueryClient;
  searchQuery: string;
  selectedCategory: string | null;
  selectedSort: string | null;
}) {
  const t = useTranslations("forum");
  const locale = useLocale();
  const dateFnsLocale = locale === "id" ? id : enUS;
  const currentUser = useCurrentUser();

  const form = useForm<TCommentSchema>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
      forumId: forumId,
    },
  });

  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const {
    data: comments,
    isError,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["comments", forumId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/forum/${forumId}/comment`);
      return res.data.data as CommentProps[];
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (data: TCommentSchema) => {
      const res = await axiosInstance.post(
        `/api/forum/${data.forumId}/comment`,
        {
          data,
        },
      );

      return res.data;
    },
    onMutate: async ({ comment, forumId }) => {
      await queryClient.cancelQueries({ queryKey: ["comments", forumId] });
      await queryClient.cancelQueries({
        queryKey: ["fetchForum", searchQuery, selectedCategory, selectedSort],
      });

      const previousComments = queryClient.getQueryData([
        "comments",
        forumId,
      ]) as CommentProps[];

      const previousForums = queryClient.getQueryData([
        "fetchForum",
        searchQuery,
        selectedCategory,
        selectedSort,
      ]) as InfiniteQueryDataProps;

      queryClient.setQueryData(
        ["comments", forumId],
        [
          {
            id: Math.random().toString(9),
            comment: comment,
            createdAt: new Date().toISOString(),
            user: {
              username: currentUser?.username,
              image: currentUser?.image,
              id: currentUser?.id,
            },
          },
          ...previousComments, // Tambahkan komentar baru di awal array
        ],
      );

      queryClient.setQueryData(
        ["fetchForum", searchQuery, selectedCategory, selectedSort],
        (oldData: InfiniteQueryDataProps | undefined) => {
          if (!oldData || !oldData.pages) return { pageParams: [], pages: [] };

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              forums: page.forums.map((forum) =>
                forum.id === forumId
                  ? {
                      ...forum,
                      comments: [
                        ...forum.comments,
                        { id: Math.random().toString(9) }, // Tambah dummy ID
                      ],
                    }
                  : forum,
              ),
            })),
          };
        },
      );

      return { previousComments, previousForums };
    },
    onSuccess: () => {
      setNewComment("");
    },
    onError: (error: CustomError, { forumId }, context) => {
      console.log(error);

      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", forumId],
          context.previousComments,
        );
      }

      if (context?.previousForums) {
        queryClient.setQueryData(
          ["fetchForum", searchQuery, selectedCategory, selectedSort],
          context.previousForums,
        );
      }
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      forumId,
    }: {
      commentId: string;
      forumId: string;
    }) => {
      const res = await axiosInstance.delete(
        `/api/forum/${forumId}/comment?commentId=${commentId}`,
      );

      return res.data;
    },
    onMutate: async ({ commentId, forumId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments", forumId] });
      await queryClient.cancelQueries({
        queryKey: ["fetchForum", searchQuery, selectedCategory, selectedSort],
      });

      // Save current state
      const previousComments = queryClient.getQueryData([
        "comments",
        forumId,
      ]) as CommentProps[];

      const previousForums = queryClient.getQueryData([
        "fetchForum",
        searchQuery,
        selectedCategory,
        selectedSort,
      ]) as InfiniteQueryDataProps;

      // Optimistically update comments by removing the deleted comment
      queryClient.setQueryData(
        ["comments", forumId],
        previousComments.filter((comment) => comment.id !== commentId),
      );

      // Update forum data to reflect the deleted comment
      queryClient.setQueryData(
        ["fetchForum", searchQuery, selectedCategory, selectedSort],
        (oldData: InfiniteQueryDataProps | undefined) => {
          if (!oldData || !oldData.pages) return { pageParams: [], pages: [] };

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              forums: page.forums.map((forum) =>
                forum.id === forumId
                  ? {
                      ...forum,
                      comments: forum.comments.filter((comment) =>
                        typeof comment === "object"
                          ? comment.id !== commentId
                          : true,
                      ),
                    }
                  : forum,
              ),
            })),
          };
        },
      );

      return { previousComments, previousForums };
    },
    onError: (error: CustomError, { forumId }, context) => {
      console.log(error);

      // Restore previous data if there's an error
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", forumId],
          context.previousComments,
        );
      }

      if (context?.previousForums) {
        queryClient.setQueryData(
          ["fetchForum", searchQuery, selectedCategory, selectedSort],
          context.previousForums,
        );
      }
    },
    onSettled: (_, __, { forumId }) => {
      // Invalidate and refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["comments", forumId] });
      queryClient.invalidateQueries({
        queryKey: ["fetchForum", searchQuery, selectedCategory, selectedSort],
      });
      setCommentToDelete(null);
    },
  });

  if (commentMutation.isError) {
    console.log(commentMutation.error.response?.data.status);
    toast.error(t("generalError"), {
      position: "top-right",
      duration: 3000,
    });
    commentMutation.reset();
  }

  if (deleteCommentMutation.isError) {
    toast.error(t("generalError"), {
      position: "top-right",
      duration: 3000,
    });
    deleteCommentMutation.reset();
  }

  if (isError) {
    return (
      <div className="mt-2 border-t px-6 py-4">
        <div className="py-8 text-center">
          <p className="mt-2 text-muted-foreground">{t("generalError")}</p>
          <Button onClick={() => refetch()} className="mt-4">
            {t("retryBtn")}
          </Button>
        </div>
      </div>
    );
  }

  const visibleComments = showAllComments ? comments : comments?.slice(0, 2);

  return (
    <div className="mt-2 border-t px-6 py-4">
      <h3 className="mb-4 text-lg font-semibold">{t("discussion")}</h3>
      {isPending ? (
        <div className="flex space-x-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <>
          {comments.length === 0 ? (
            <div className="mb-4 text-center">
              <p className="text-muted-foreground">{t("firstThought")}</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {visibleComments?.map((comment) => {
                  const isCurrentUserComment =
                    comment.user.id === currentUser?.id;

                  return (
                    <div className="flex justify-between" key={comment.id}>
                      <div className="flex space-x-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={comment.user.image}
                            alt={comment.user.username}
                          />
                          <AvatarFallback>
                            {comment.user.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-1">
                            <h4 className="text-sm font-semibold">
                              {comment.user.username}
                            </h4>
                            <small className="text-xs text-muted-foreground">
                              •
                            </small>
                            <small className="text-xs text-muted-foreground">
                              {formatDistanceToNowStrict(
                                new Date(comment.createdAt),
                                {
                                  locale: dateFnsLocale,
                                  addSuffix: true,
                                },
                              )}
                            </small>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                      {isCurrentUserComment && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg"
                              aria-label="Comment options"
                            >
                              <MoreVertical className="h-4 w-4 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem
                              className="text-destructive hover:cursor-pointer focus:text-destructive"
                              onClick={() => {
                                setCommentToDelete(comment.id);
                                setIsAlertOpen(true);
                                document.body.style.pointerEvents = "";
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("deleteBtn")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  );
                })}
              </div>
              {comments.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-muted-foreground"
                  onClick={() => setShowAllComments(!showAllComments)}
                >
                  {showAllComments ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      {t("hideComment")}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      {t("showComment")}
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </>
      )}
      <Form {...form}>
        <form
          className="mt-6 flex space-x-2"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(() => {
              commentMutation.mutate({ comment: newComment, forumId: forumId });
            });
          }}
        >
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("addComment")}
                    value={newComment}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setNewComment(e.target.value);
                    }}
                    className="flex-1 text-sm"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={commentMutation.isPending || newComment.trim() === ""}
            onClick={() =>
              commentMutation.mutate({ comment: newComment, forumId: forumId })
            }
          >
            {commentMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              t("post")
            )}
          </Button>
        </form>
      </Form>

      <Alert
        title={t("alertTitle")}
        description={t("alertDescription")}
        open={isAlertOpen}
        onOpenChange={(open) => setIsAlertOpen(open)}
        onSubmit={() => {
          if (commentToDelete) {
            deleteCommentMutation.mutate({
              commentId: commentToDelete,
              forumId: forumId,
            });
          }
          setIsAlertOpen(false);
        }}
      />
    </div>
  );
}
