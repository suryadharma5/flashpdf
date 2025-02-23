"use client";

import { Empty } from "@/components/dashboard/empty";
import ErrorPage from "@/components/dashboard/error";
import { Alert } from "@/components/dashboard/library/alert-dialog";
import { ShareDialog } from "@/components/dashboard/library/share-dialog";
import { LoadingPage } from "@/components/dashboard/loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { axiosInstance } from "@/lib/axios";
import { TDeleteForumSchema } from "@/lib/types/forum";
import { Forum, Question } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import {
  Book,
  CheckCircle,
  ChevronsUp,
  CircleAlert,
  Clock9,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

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
};

export default function Page() {
  const [showDialog, setShowDialog] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [onSubmitAction, setOnSubmitAction] = useState<() => void>(
    () => () => {},
  );
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");

  const queryClient = useQueryClient();

  const { data, isError, isPending } = useQuery({
    queryKey: ["fetchDocument"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/material");
      return res.data;
    },
  });

  const deleteForumMutation = useMutation({
    mutationFn: async (data: TDeleteForumSchema) => {
      const res = await axiosInstance.delete(
        `/api/forum?documentId=${data.documentId}&forumId=${data.forumId}`,
      );

      return res.data;
    },
    onSuccess: () => {
      toast.success("Flashcard set removed!", {
        duration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["fetchDocument"] });
    },
    onError: (e) => {
      console.log(e.message);
    },
  });

  const showAlert = (
    title: string,
    description: string,
    onSubmit: () => void,
  ) => {
    setOnSubmitAction(() => onSubmit);
    setIsAlertOpen(true);
    setAlertTitle(title);
    setAlertDescription(description);
  };

  const handleDelete = (documentId: string, forumId: string) => {
    const data = {
      documentId,
      forumId,
    };

    deleteForumMutation.mutate(data);
  };

  const isPostTestComplete = (histories: HistoryProps[]) => {
    for (const history of histories) {
      if (history.type.toLowerCase() === "posttest") {
        return true;
      }
    }
    return false;
  };

  if (isPending) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  const documents: DocumentProps[] = data.data;

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6">
      <h1 className="mb-6 text-3xl font-bold">Library</h1>
      {documents.length > 0 ? (
        documents.map((data) => (
          <div
            className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3"
            key={data.id}
          >
            <Card className="flex w-full flex-col transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="flex w-full">
                  <div className="w-full p-0">
                    <CardTitle className="flex w-full items-center justify-between">
                      {data.title
                        .replace(
                          data.title.charAt(0),
                          data.title.charAt(0).toUpperCase(),
                        )
                        .slice(0, 20)}

                      {data.title.length > 20 ? "..." : ""}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center">
                          {data.isPublic ? (
                            <DropdownMenuItem
                              className="hover:cursor-pointer"
                              onClick={() => {
                                // handleDelete(data.id, data.Forum[0].id);
                                showAlert(
                                  "Are you sure?",
                                  "Changing this document to private will remove its associated forum data. Are you sure you want to proceed?",
                                  () => handleDelete(data.id, data.Forum[0].id),
                                );
                                document.body.style.pointerEvents = "";
                              }}
                            >
                              Make private
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="hover:cursor-pointer"
                              onClick={() => {
                                setShowDialog(!showDialog);
                                document.body.style.pointerEvents = "";
                              }}
                            >
                              Make public
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="hover:cursor-pointer">
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 hover:cursor-pointer"
                            onClick={() => {
                              setIsAlertOpen(true);
                              document.body.style.pointerEvents = "";
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardTitle>

                    <CardDescription className="flex w-full items-center justify-between">
                      <div className="mt-2 flex items-center gap-1">
                        <Clock9 size={15} />
                        <p className="text-xs">
                          {formatDistanceToNowStrict(data.createdAt)} ago
                        </p>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <Book size={15} />
                        <p className="text-xs">
                          {data.questions.length} questions
                        </p>
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="flex flex-wrap gap-2">
                {data.History.length < 0 ? (
                  <div className="mb-2 flex rounded-md bg-yellow-100 px-3 py-1 text-yellow-800">
                    <CircleAlert className="mr-2 h-4 w-4" />
                    <p className="text-xs">
                      Complete the pretest to unlock full flashcard features.
                    </p>
                  </div>
                ) : isPostTestComplete(data.History) ? (
                  <div className="mb-2 flex w-full rounded-md bg-green-100 px-3 py-1 text-green-800">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    <p className="text-xs">Post-test completed!</p>
                  </div>
                ) : (
                  <div className="mb-2 flex w-full rounded-md bg-blue-100 px-3 py-1 text-blue-800">
                    <ChevronsUp className="mr-2 h-4 w-4" />
                    <p className="text-xs">
                      Boost your skills with a quick post-test!
                    </p>
                  </div>
                )}

                <div className="flex w-full gap-2">
                  <Link
                    className="w-full"
                    href={`/dashboard/material/library/document/${data.id}/flashcard`}
                  >
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={data.History.length <= 0}
                    >
                      View Flashcards
                    </Button>
                  </Link>

                  {data.History.length > 0 ? (
                    <Link
                      href={`/dashboard/material/library/document/${data.id}/posttest`}
                      className="w-full"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        {isPostTestComplete(data.History)
                          ? "Retake Post-test"
                          : "Take Post-test"}
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard/material/library/document/${data.id}/pretest`}
                      className="w-full"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        Take Pre-test
                      </Button>
                    </Link>
                  )}
                </div>
              </CardFooter>

              <ShareDialog
                open={showDialog}
                onOpenChange={setShowDialog}
                documentTitle={data.title}
                documentId={data.id}
                queryClient={queryClient}
              />
            </Card>

            <Alert
              title={alertTitle}
              description={alertDescription}
              open={isAlertOpen}
              onOpenChange={(open) => setIsAlertOpen(open)}
              onSubmit={onSubmitAction}
            />
          </div>
        ))
      ) : (
        <Empty
          description="You have not upload any document yet"
          isActionButtonNeeded={true}
          actionButtonLink="/dashboard/material/create"
          actionButtonText="Upload now"
        />
      )}
    </div>
  );
}
