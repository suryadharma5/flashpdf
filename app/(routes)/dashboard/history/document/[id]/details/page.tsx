"use client";

import ErrorPage from "@/components/dashboard/error";
import { LoadingPage } from "@/components/dashboard/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { axiosInstance } from "@/lib/axios";
import { categoryColors } from "@/lib/util/category";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Award,
  BarChart,
  ChevronLeft,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

type DocumentProps = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
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
  document: DocumentProps;
};

type ParamsProps = {
  id: string;
};

export default function HistoryDetailPage() {
  const t = useTranslations("history");
  const params: ParamsProps = useParams();
  const isMobile = useIsMobile();

  const { data, isError, isPending } = useQuery({
    queryKey: ["fetchHistory", params.id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/history?documentId=${params.id}`,
      );
      return res.data.data as TestHistoryProps[];
    },
  });

  const calculateAverageGrade = (tests: TestHistoryProps[]): string => {
    const totalGrade = tests.reduce((sum, test) => sum + test.grade, 0);
    return (totalGrade / tests.length).toFixed(1);
  };

  const calculateMaxGrade = (tests: TestHistoryProps[]) => {
    return Math.max(...tests.map((test) => test.grade));
  };

  const firstPretest = data?.find(
    (attempt) => attempt.type.toLowerCase() === "pretest",
  );

  const latestPosttest = data
    ? [...data]
        .reverse()
        .find((attempt) => attempt.type.toLowerCase() === "posttest")
    : null;

  let improvement = 0;
  let improvementPercentage = 0;

  if (firstPretest && latestPosttest) {
    improvement = latestPosttest.grade - firstPretest.grade;
    improvementPercentage = (improvement / firstPretest.grade) * 100;
  }

  if (isPending) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6">
      <div
        className={`mb-6 ${isMobile ? "flex-col" : "flex"} items-center gap-3`}
      >
        <div className="flex gap-4">
          <Link href="/dashboard/history">
            <Button variant="ghost" size={"icon"}>
              <ChevronLeft className="h-7 w-7" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">
            {data[0].document.title.charAt(0).toUpperCase() +
              data[0].document.title.slice(1).toLowerCase()}{" "}
            summary
          </h1>
        </div>
        <Badge
          className={`${categoryColors[data[0].document.Category.name]} ${isMobile ? "ml-12" : ""} h-fit`}
          variant={"default"}
        >
          {data[0].document.Category.name.replace(
            data[0].document.Category.name.charAt(0),
            data[0].document.Category.name.charAt(0).toUpperCase(),
          )}
        </Badge>
      </div>

      <div className="mb-6 grid gap-4 px-5 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("avgGrade")}
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateAverageGrade(data)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("highGrade")}
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateMaxGrade(data)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("improvement")}
            </CardTitle>
            {improvementPercentage >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold",
                improvementPercentage >= 0 ? "text-green-500" : "text-red-500",
              )}
            >
              {improvementPercentage > 0 ? "+" : ""}
              {improvementPercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">{t("fromPretest")}</p>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("type")}</TableHead>
            <TableHead>{t("grade")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((attempt) => (
            <TableRow key={attempt.id}>
              <TableCell>
                {format(new Date(attempt.createdAt), "dd MMM yyyy")}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    attempt.type.toLowerCase() === "pretest"
                      ? "secondary"
                      : "default"
                  }
                >
                  {attempt.type.toLowerCase() === "pretest"
                    ? "Pre-Test"
                    : "Post-Test"}
                </Badge>
              </TableCell>
              <TableCell>{attempt.grade}</TableCell>
              <TableCell>
                <Link
                  href={`/dashboard/history/document/${attempt.documentId}/review/${attempt.id}`}
                >
                  <Button variant="outline" size="sm">
                    {t("viewResult")}
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
