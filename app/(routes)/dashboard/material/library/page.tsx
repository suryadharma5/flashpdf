"use client";

import { Empty } from "@/components/dashboard/empty";
import ErrorPage from "@/components/dashboard/error";
import { Alert } from "@/components/dashboard/library/alert-dialog";
import { ShareDialog } from "@/components/dashboard/library/share-dialog";
import { LoadingPage } from "@/components/dashboard/loading";
import { Dropdown } from "@/components/dashboard/material/dropdown-library";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { axiosInstance } from "@/lib/axios";
import { TDeleteForumSchema } from "@/lib/types/forum";
import { categoryColors } from "@/lib/util/category";
import EmptyImage from "@/public/Chill-Time.svg";
import { Forum, Question } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import { CheckCircle, ChevronsUp, CircleAlert, Clock9 } from "lucide-react";
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
  Category: {
    name: string;
  };
};

const categoryColors: Record<string, string> = {
  science: "green-400",
  "social study": "zinc-400",
  programming: "yellow-400",
  language: "rose-200",
  math: "purple-400",
  others: "indigo-400",
};

export default function Page() {
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [onSubmitAction, setOnSubmitAction] = useState<() => void>(
    () => () => {},
  );
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");

  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

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

  const isPostTestComplete = (histories: HistoryProps[]) =>
    histories.some((history) => history.type.toLowerCase() === "posttest");

  const toggleDialog = (id: string) => {
    setOpenDialogId((prevId) => (prevId === id ? null : id));
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
      <h1 className="mb-8 w-full text-start text-3xl font-bold">Library</h1>
      {documents.length > 0 ? (
        <div
          className={`grid w-full md:grid-cols-2 lg:grid-cols-3 ${isMobile ? "gap-4" : "gap-6"}`}
        >
          {documents.map((data) => (
            <div key={data.id}>
              <Card className="flex w-full flex-col transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex w-full">
                    <div className="w-full p-0">
                      <CardTitle className="">
                        <div className="mb-2 flex w-full items-center justify-between">
                          <Badge
                            className={`border-2 border-${categoryColors[data.Category.name]}`}
                            variant={"outline"}
                          >
                            {data.Category.name.replace(
                              data.Category.name.charAt(0),
                              data.Category.name.charAt(0).toUpperCase(),
                            )}
                          </Badge>

                          <Dropdown
                            items={[
                              data.isPublic
                                ? {
                                    label: "Make private",
                                    onClick: () => {
                                      showAlert(
                                        "Are you sure?",
                                        "Changing this document to private will remove its associated forum data. Are you sure you want to proceed?",
                                        () =>
                                          handleDelete(
                                            data.id,
                                            data.Forum[0].id,
                                          ),
                                      );
                                      document.body.style.pointerEvents = "";
                                    },
                                  }
                                : {
                                    label: "Make public",
                                    onClick: () => {
                                      toggleDialog(data.id);
                                      document.body.style.pointerEvents = "";
                                    },
                                  },
                              {
                                label: "Delete",
                                className: "text-red-600",
                                onClick: () => {
                                  document.body.style.pointerEvents = "";
                                  showAlert(
                                    "Are you sure?",
                                    "Deleting this document is permanent and cannot be reversed. Are you sure you want to proceed?",
                                    () => console.log("halo"),
                                  );
                                  // document.body.style.pointerEvents = "";
                                },
                              },
                            ]}
                          />
                        </div>

                        <p className="text-xl font-semibold text-gray-900">
                          {data.title
                            .replace(
                              data.title.charAt(0),
                              data.title.charAt(0).toUpperCase(),
                            )
                            .slice(0, 20)}
                          {data.title.length > 20 ? "..." : ""}
                        </p>
                      </CardTitle>

                      <CardDescription className="flex w-full items-center justify-between">
                        <div className="mt-2 flex items-center gap-1">
                          <Clock9 size={15} />
                          <p className="text-xs">
                            {formatDistanceToNowStrict(data.createdAt)} ago
                          </p>
                        </div>
                        <div className="mt-2 flex items-center gap-1">
                          <p className="text-sm">
                            {data.questions.length} question
                            {data.questions.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="flex flex-wrap gap-2">
                  {data.History.length === 0 ? (
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

                  <div className="flex w-full flex-col gap-2">
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
                  open={openDialogId === data.id}
                  onOpenChange={() => setOpenDialogId(null)}
                  documentTitle={data.title}
                  documentId={data.id}
                  queryClient={queryClient}
                />
              </Card>
            </div>
          ))}

          <Alert
            title={alertTitle}
            description={alertDescription}
            open={isAlertOpen}
            onOpenChange={(open) => setIsAlertOpen(open)}
            onSubmit={onSubmitAction}
          />
        </div>
      ) : (
        <Empty
          image={EmptyImage}
          description="You have not upload any document yet"
          isActionButtonNeeded={true}
          actionButtonLink="/dashboard/material/create"
          actionButtonText="Upload now"
        />
      )}
    </div>
  );
}
