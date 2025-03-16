"use client";

import { Empty } from "@/components/dashboard/empty";
import ErrorPage from "@/components/dashboard/error";
import { FilterSearch } from "@/components/dashboard/filtersearch";
import { Alert } from "@/components/dashboard/library/alert-dialog";
import { ShareDialog } from "@/components/dashboard/library/share-dialog";
import { Dropdown } from "@/components/dashboard/material/dropdown-library";
import { PaginationNavigator } from "@/components/dashboard/pagination";
import { SkeletonCard } from "@/components/dashboard/skeleton-card";
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

type PaginatedDocumentProps = {
  documents: DocumentProps[];
  totalEntries: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export default function Page() {
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [onSubmitAction, setOnSubmitAction] = useState<() => void>(
    () => () => {},
  );
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const fetchDocument = async (pageNum: number) => {
    const res = await axiosInstance.get(
      `/api/material?limit=6&page=${pageNum}`,
    );
    return res.data.data as PaginatedDocumentProps;
  };

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["documents", currentPage],
    queryFn: () => fetchDocument(currentPage),
  });

  const documents = data?.documents ?? [];

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

  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const res = await axiosInstance.delete(
        `/api/material?documentId=${documentId}`,
      );

      return res.data;
    },
    onSuccess: () => {
      toast.success("Document removed!", {
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

  const filteredDocuments = documents?.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredCategoryDocuments = filteredDocuments?.filter((doc) =>
    selectedCategory ? doc.Category.name === selectedCategory : true,
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleSkip = (destination: "start" | "end") => {
    switch (destination) {
      case "start":
        setCurrentPage(1);
        break;
      case "end":
        setCurrentPage(data?.totalPages ?? 1);
        break;
    }
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

  if (isError) {
    console.error(error);
    return <ErrorPage />;
  }

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6">
      <h1 className="mb-8 w-full text-start text-3xl font-bold">
        My Flashcards
      </h1>
      {isLoading || isFetching ? (
        <>
          <FilterSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            placeHolder="Search documents..."
          />
          <div
            className={`grid w-full md:grid-cols-2 lg:grid-cols-3 ${isMobile ? "gap-4" : "gap-6"}`}
          >
            {[...Array(3)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </>
      ) : documents.length > 0 ? (
        <>
          <FilterSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            placeHolder="Search flashcard..."
          />
          <div className="w-full">
            {filteredCategoryDocuments &&
            filteredCategoryDocuments.length > 0 ? (
              <div
                className={`grid w-full md:grid-cols-2 lg:grid-cols-3 ${isMobile ? "gap-4" : "gap-6"}`}
              >
                {filteredCategoryDocuments.map((data) => (
                  <div key={data.id}>
                    <Card className="flex w-full flex-col transition-all duration-300 hover:shadow-lg">
                      <CardHeader>
                        <div className="flex w-full">
                          <div className="w-full p-0">
                            <CardTitle>
                              <div className="mb-2 flex w-full items-center justify-between">
                                <Badge
                                  className={`border-2 ${categoryColors[data.Category.name]}`}
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
                                            document.body.style.pointerEvents =
                                              "";
                                          },
                                        }
                                      : {
                                          label: "Make public",
                                          onClick: () => {
                                            toggleDialog(data.id);
                                            document.body.style.pointerEvents =
                                              "";
                                          },
                                        },
                                    {
                                      label: "Delete",
                                      className: "text-red-600",
                                      onClick: () => {
                                        document.body.style.pointerEvents = "";
                                        showAlert(
                                          "Are you sure?",
                                          "Deleting this document is permanent and will also delete all associated test history. Are you sure you want to proceed?",
                                          () => {
                                            deleteDocumentMutation.mutate(
                                              data.id,
                                            );
                                          },
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
                                  {formatDistanceToNowStrict(data.createdAt)}{" "}
                                  ago
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
                              Complete the pretest to unlock flashcards.
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
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
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
              </div>
            ) : (
              <Empty
                image={EmptyImage}
                description="Document not found"
                isActionButtonNeeded={false}
              />
            )}

            <div className="mt-6">
              <PaginationNavigator
                currPage={currentPage}
                totalPage={data?.totalPages ?? 0}
                hasNext={data?.hasNext ?? false}
                hasPrev={data?.hasPrev ?? false}
                clickNext={handleNextPage}
                clickPrevious={handlePreviousPage}
                skipToStart={() => handleSkip("start")}
                skipToEnd={() => handleSkip("end")}
              />
            </div>

            <Alert
              title={alertTitle}
              description={alertDescription}
              open={isAlertOpen}
              onOpenChange={(open) => setIsAlertOpen(open)}
              onSubmit={onSubmitAction}
            />
          </div>
        </>
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
