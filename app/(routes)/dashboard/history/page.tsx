"use client";

import { Empty } from "@/components/dashboard/empty";
import ErrorPage from "@/components/dashboard/error";
import { PaginationNavigator } from "@/components/dashboard/pagination";
import { SkeletonCard } from "@/components/dashboard/skeleton-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { axiosInstance } from "@/lib/axios";
import { categoryColors } from "@/lib/util/category";
import { cn } from "@/lib/utils";
import EmptyImage from "@/public/Chill-Time.svg";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

type Document = {
  title: string;
  Category: {
    name: string;
  };
};

type TestHistoryProps = {
  id: string;
  grade: number;
  type: string;
  documentId: string;
  createdAt: string;
  document: Document;
  averageGrade: number;
  takeTestCount: number;
};

type PaginatedTestHistoryProps = {
  histories: TestHistoryProps[];
  totalEntries: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export default function HistoryPage() {
  const t = useTranslations("history");
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTestHistory = async (pageNum: number) => {
    const url = `/api/history?limit=6&page=${pageNum}`;

    const res = await axiosInstance.get(url);

    return res.data.data as PaginatedTestHistoryProps;
  };

  const { data, isError, isPending } = useQuery({
    queryKey: ["fetchHistory", currentPage],
    queryFn: () => fetchTestHistory(currentPage),
  });

  const groupedTests = data?.histories ?? [];

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

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6">
      <h1 className="mb-8 w-full text-start text-3xl font-bold">
        {t("title")}
      </h1>

      {isPending ? (
        <div
          className={`grid w-full md:grid-cols-2 lg:grid-cols-3 ${isMobile ? "gap-4" : "gap-6"}`}
        >
          {[...Array(3)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <>
          {groupedTests && groupedTests.length > 0 ? (
            <div className="mb-6 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {groupedTests?.map((history) => {
                return (
                  <Card
                    key={history.documentId}
                    className="flex flex-col transition-all duration-300 hover:shadow-lg"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold text-gray-900">
                          {history.document.title.charAt(0).toUpperCase() +
                            history.document.title.slice(1).toLowerCase()}
                        </CardTitle>
                        <Badge
                          className={`${categoryColors[history.document.Category.name]} w-fit`}
                          variant={"default"}
                        >
                          {history.document.Category.name.replace(
                            history.document.Category.name.charAt(0),
                            history.document.Category.name
                              .charAt(0)
                              .toUpperCase(),
                          )}
                        </Badge>
                      </div>
                      <Badge variant={"default"} className="w-fit">
                        {history.takeTestCount} attempt
                        {history.takeTestCount > 1 ? "s" : ""}
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="text-3xl font-bold">
                        {history.averageGrade.toFixed(1)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("avgGrade")}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href={`/dashboard/history/document/${history.documentId}/details`}
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full">
                          {t("viewDetail")}{" "}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Empty
              image={EmptyImage}
              isActionButtonNeeded={false}
              description={t("noHistoryYet")}
            />
          )}
        </>
      )}
      <div
        className={cn(
          "mt-6",
          groupedTests.length < 4 && !isMobile
            ? "absolute bottom-7 right-24"
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
  );
}
