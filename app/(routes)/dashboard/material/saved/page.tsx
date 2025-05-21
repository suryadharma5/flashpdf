"use client";

import { Empty } from "@/components/dashboard/empty";
import ErrorPage from "@/components/dashboard/error";
import { FilterSearch } from "@/components/dashboard/filtersearch";
import { Alert } from "@/components/dashboard/library/alert-dialog";
import { Dropdown } from "@/components/dashboard/material/dropdown-library";
import { PaginationNavigator } from "@/components/dashboard/pagination";
import { SkeletonCard } from "@/components/dashboard/skeleton-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { axiosInstance } from "@/lib/axios";
import { categoryColors } from "@/lib/util/category";
import { cn } from "@/lib/utils";
import EmptyImage from "@/public/Chill-Time.svg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, ChevronsUp, CircleAlert, TrashIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type HistoryProps = {
  id: string;
  type: string;
};

type DocumentProps = {
  id: string;
  title: string;
  user: {
    username: string;
  };
  _count: {
    questions: number;
  };
  History: HistoryProps[];
  Category: {
    name: string;
  };
};

type SavedDocument = {
  document: DocumentProps;
};

type PaginatedSavedDocumentProps = {
  documents: SavedDocument[];
  totalEntries: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export default function SavedDocumentsPage() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [onSubmitAction, setOnSubmitAction] = useState<() => void>(
    () => () => {},
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const t = useTranslations("myFlashcard");
  const locale = useLocale();

  const fetchSavedDocument = async () => {
    let url = `/api/save?limit=6&page=${currentPage}`;

    if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
      url = url.concat(`&query=${debouncedSearchQuery}`);
    }

    if (selectedCategory) {
      url = url.concat(`&category=${selectedCategory}`);
    }

    const res = await axiosInstance.get(url);

    return res.data.data as PaginatedSavedDocumentProps;
  };

  const { data, isError, isLoading, isFetching } = useQuery({
    queryKey: [
      "fetchSavedDocuments",
      currentPage,
      debouncedSearchQuery,
      selectedCategory,
    ],
    queryFn: () => fetchSavedDocument(),
    enabled: debouncedSearchQuery === "" || debouncedSearchQuery.length >= 3,
  });

  const documents = data?.documents || [];
  const initialData: PaginatedSavedDocumentProps | undefined =
    queryClient.getQueryData(["fetchSavedDocuments", 1, "", null]);

  const deleteSavedDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const res = await axiosInstance.delete(
        `/api/save?documentId=${documentId}`,
      );

      return res.data;
    },
    onSuccess: () => {
      toast.success(t("alertDocumentDeleted"), {
        duration: 3000,
      });

      queryClient.invalidateQueries({
        queryKey: [
          "fetchSavedDocuments",
          currentPage,
          debouncedSearchQuery,
          selectedCategory,
        ],
      });
    },
    onError: (e) => {
      console.log(e.message);
    },
  });

  const isPostTestComplete = (histories: HistoryProps[]) =>
    histories.some((history) => history.type.toLowerCase() === "posttest");

  const showAlert = (
    title: string,
    description: string,
    onSubmit: () => void,
  ) => {
    setIsAlertOpen(true);
    setAlertTitle(title);
    setAlertDescription(description);
    setOnSubmitAction(() => onSubmit);
  };

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

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.length >= 3 || searchQuery === "") {
        setDebouncedSearchQuery(searchQuery);

        if (currentPage !== 1) setCurrentPage(1);
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
        {t("titleSaved")}
      </h1>

      <FilterSearch
        searchTerm={searchQuery}
        setSearchTerm={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        placeHolder={t("searchFlashcard")}
      />

      {isLoading || isFetching ? (
        <div
          className={`grid w-full md:grid-cols-2 lg:grid-cols-3 ${isMobile ? "gap-4" : "gap-6"}`}
        >
          {[...Array(3)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : documents && (initialData?.documents.length ?? 0) > 0 ? (
        <>
          <div className="relative min-h-[65vh] w-full">
            {documents && documents.length > 0 ? (
              <div
                className={`grid w-full md:grid-cols-2 lg:grid-cols-3 ${isMobile ? "gap-4" : "gap-6"}`}
              >
                {documents.map((doc) => (
                  <Card
                    key={doc.document.id}
                    className="transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-6">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="w-full">
                          <CardTitle>
                            <div className="mb-2 flex w-full items-center justify-between">
                              <Badge
                                className={`${categoryColors[doc.document.Category.name]}`}
                                variant={"default"}
                              >
                                {doc.document.Category.name.replace(
                                  doc.document.Category.name.charAt(0),
                                  doc.document.Category.name
                                    .charAt(0)
                                    .toUpperCase(),
                                )}
                              </Badge>
                              <Dropdown
                                items={[
                                  {
                                    label: t("deleteFlashcardBtn"),
                                    className: "text-red-700",
                                    onClick: () => {
                                      showAlert(
                                        t("alertTitle"),
                                        t("alertMessageDelete"),
                                        () => {
                                          deleteSavedDocumentMutation.mutate(
                                            doc.document.id,
                                          );
                                        },
                                      );
                                      document.body.style.pointerEvents = "";
                                    },
                                    icon: <TrashIcon />,
                                  },
                                ]}
                              />
                            </div>
                            <h2 className="mb-1 text-xl font-semibold text-gray-900">
                              {doc.document.title.replace(
                                doc.document.title.charAt(0),
                                doc.document.title.charAt(0).toUpperCase(),
                              )}
                            </h2>
                          </CardTitle>
                          <p className="mb-2 flex items-center justify-between text-sm text-gray-500">
                            <span>
                              {t("by")} {doc.document.user.username}
                            </span>
                            <span>
                              {doc.document._count.questions} {t("question")}
                              {doc.document._count.questions > 1 &&
                              locale === "en"
                                ? "s"
                                : ""}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between"></div>
                      {doc.document.History.length <= 0 ? (
                        <div className="mb-2 flex rounded-md bg-yellow-100 px-3 py-1 text-yellow-800">
                          <CircleAlert className="mr-2 h-4 w-4" />
                          <p className="text-xs">{t("warnCompletePretest")}</p>
                        </div>
                      ) : isPostTestComplete(doc.document.History) ? (
                        <div className="mb-2 flex w-full rounded-md bg-green-100 px-3 py-1 text-green-800">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <p className="text-xs">
                            {" "}
                            {t("warnPostTestComplete")}
                          </p>
                        </div>
                      ) : (
                        <div className="mb-2 flex w-full rounded-md bg-blue-100 px-3 py-1 text-blue-800">
                          <ChevronsUp className="mr-2 h-4 w-4" />
                          <p className="text-xs">{t("warnCompletePosttest")}</p>
                        </div>
                      )}

                      <div className="mt-4 flex w-full flex-col gap-2">
                        {doc.document.History.length > 0 ? (
                          <Link
                            className="w-full"
                            href={`/dashboard/material/library/document/${doc.document.id}/flashcard`}
                          >
                            <Button size="sm" className="w-full">
                              {t("viewFlashcardBtn")}
                            </Button>
                          </Link>
                        ) : (
                          <Button size="sm" className="w-full" disabled>
                            {t("viewFlashcardBtn")}
                          </Button>
                        )}

                        {doc.document.History.length > 0 ? (
                          <Link
                            href={`/dashboard/material/library/document/${doc.document.id}/posttest`}
                            className="w-full"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              {isPostTestComplete(doc.document.History)
                                ? t("retakePosttestBtn")
                                : t("takePosttestBtn")}
                            </Button>
                          </Link>
                        ) : (
                          <Link
                            href={`/dashboard/material/library/document/${doc.document.id}/pretest`}
                            className="w-full"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              {t("takePretestBtn")}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
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
                description={t("documentNotFound")}
                isActionButtonNeeded={false}
              />
            )}

            <div
              className={cn(
                "mt-6",
                documents.length < 4 && !isMobile
                  ? "absolute bottom-0 right-0"
                  : "",
              )}
            >
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
          </div>
        </>
      ) : (
        <Empty
          image={EmptyImage}
          description={t("savedDocumentEmpty")}
          isActionButtonNeeded={true}
          actionButtonLink="/dashboard/forum"
          actionButtonText="Explore forum"
        />
      )}
    </div>
  );
}
