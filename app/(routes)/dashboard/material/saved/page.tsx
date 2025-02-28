"use client";

import { Empty } from "@/components/dashboard/empty";
import ErrorPage from "@/components/dashboard/error";
import { LoadingPage } from "@/components/dashboard/loading";
import { PopoverStudyMenu } from "@/components/dashboard/save/popover-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import EmptyImage from "@/public/Chill-Time.svg";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";

type Document = {
  title: string;
  user: {
    username: string;
  };
  _count: {
    questions: number;
  };
  History: [
    {
      id: string;
    },
  ];
};

type DocumentProps = {
  documentId: string;
  document: Document;
};

export default function SavedDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

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

  console.log({ documents });

  const filteredDocuments = documents?.filter(
    (doc) =>
      doc.document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document.user.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

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
                        <div>
                          <h2 className="mb-1 text-xl font-semibold text-gray-900">
                            {doc.document.title.replace(
                              doc.document.title.charAt(0),
                              doc.document.title.charAt(0).toUpperCase(),
                            )}
                          </h2>
                          <p className="mb-2 text-sm text-gray-500">
                            by {doc.document.user.username}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className="font-medium">category</Badge>
                        <span className="text-sm text-gray-500">
                          {doc.document._count.questions} question
                          {doc.document._count.questions !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="mt-4">
                        <PopoverStudyMenu
                          documentId={doc.documentId}
                          isPretest={doc.document.History.length <= 0}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
