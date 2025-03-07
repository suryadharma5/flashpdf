"use client";

import { Empty } from "@/components/dashboard/empty";
import ErrorPage from "@/components/dashboard/error";
import { Alert } from "@/components/dashboard/library/alert-dialog";
import { LoadingPage } from "@/components/dashboard/loading";
import { Dropdown } from "@/components/dashboard/material/dropdown-library";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { categoryColors } from "@/lib/util/category";
import EmptyImage from "@/public/Chill-Time.svg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  ChevronsUp,
  CircleAlert,
  Search,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type HistoryProps = {
  id: string;
  type: string;
};

type Document = {
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

type DocumentProps = {
  documentId: string;
  document: Document;
};

export default function SavedDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const [onSubmitAction, setOnSubmitAction] = useState<() => void>(
    () => () => {},
  );

  const queryClient = useQueryClient();

  const {
    data: documents,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["fetchSavedDocuments"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/save");
      return res.data.data as DocumentProps[];
    },
  });

  const deleteSavedDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const res = await axiosInstance.delete(
        `/api/save?documentId=${documentId}`,
      );

      return res.data;
    },
    onSuccess: () => {
      toast.success("Document removed!", {
        duration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["fetchSavedDocuments"] });

      console.log("Success");
    },
    onError: (e) => {
      console.log(e.message);
    },
  });

  const filteredDocuments = documents?.filter(
    (doc) =>
      doc.document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document.user.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

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

  if (isPending) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="container mx-auto flex max-w-7xl flex-col items-start p-4">
      <h1 className="mb-8 w-full text-start text-3xl font-bold">
        Saved Flashcards
      </h1>

      {documents && documents.length > 0 ? (
        <>
          <div className="relative mb-8 w-full">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="text"
              placeholder="Search saved materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-gray-200 bg-white py-3 pl-10 text-lg"
            />
          </div>

          <div className="w-full">
            {filteredDocuments && filteredDocuments.length > 0 ? (
              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDocuments.map((doc) => (
                  <Card
                    key={doc.documentId}
                    className="transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-6">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="w-full">
                          <CardTitle>
                            <div className="mb-2 flex w-full items-center justify-between">
                              <Badge
                                className={`border-2 border-${categoryColors[doc.document.Category.name]}`}
                                variant={"outline"}
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
                                    label: "Delete",
                                    className: "text-red-700",
                                    onClick: () => {
                                      showAlert(
                                        "Are you sure?",
                                        "Deleting this document is permanent and cannot be reversed. Are you sure you want to proceed?",
                                        () => {
                                          deleteSavedDocumentMutation.mutate(
                                            doc.documentId,
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
                            <span>by {doc.document.user.username}</span>
                            <span>
                              {doc.document._count.questions} question
                              {doc.document._count.questions !== 1 ? "s" : ""}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between"></div>
                      {doc.document.History.length <= 0 ? (
                        <div className="mb-2 flex rounded-md bg-yellow-100 px-3 py-1 text-yellow-800">
                          <CircleAlert className="mr-2 h-4 w-4" />
                          <p className="text-xs">
                            Complete pretest to unlock flashcards!
                          </p>
                        </div>
                      ) : isPostTestComplete(doc.document.History) ? (
                        <div className="mb-2 flex w-full rounded-md bg-green-100 px-3 py-1 text-green-800">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <p className="text-xs">Post-test completed!</p>
                        </div>
                      ) : (
                        <div className="mb-2 flex w-full rounded-md bg-blue-100 px-3 py-1 text-blue-800">
                          <ChevronsUp className="mr-2 h-4 w-4" />
                          <p className="text-xs">
                            Boost your skills with post-test!
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex w-full flex-col gap-2">
                        <Link
                          className="w-full"
                          href={`/dashboard/material/library/document/${doc.documentId}/flashcard`}
                        >
                          <Button
                            size="sm"
                            className="w-full"
                            disabled={doc.document.History.length <= 0}
                          >
                            View Flashcards
                          </Button>
                        </Link>

                        {doc.document.History.length > 0 ? (
                          <Link
                            href={`/dashboard/material/library/document/${doc.documentId}/posttest`}
                            className="w-full"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              {isPostTestComplete(doc.document.History)
                                ? "Retake Post-test"
                                : "Take Post-test"}
                            </Button>
                          </Link>
                        ) : (
                          <Link
                            href={`/dashboard/material/library/document/${doc.documentId}/pretest`}
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
                description="Document not found"
                isActionButtonNeeded={false}
              />
            )}
          </div>
        </>
      ) : (
        <Empty
          image={EmptyImage}
          description="You have not saved any document yet"
          isActionButtonNeeded={true}
          actionButtonLink="/dashboard/forum"
          actionButtonText="Explore forum"
        />
      )}
    </div>
  );
}
