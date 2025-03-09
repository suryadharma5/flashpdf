"use client";

import ErrorPage from "@/components/dashboard/error";
import { LoadingPage } from "@/components/dashboard/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { BarChart, ChevronRight, GraduationCap, Trophy } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

type Document = {
  title: string;
};

type TestHistoryProps = {
  id: string;
  grade: number;
  type: string;
  documentId: string;
  createdAt: string;
  document: Document;
};

export default function HistoryPage() {
  const {
    data: testHistory,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["fetchHistory"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/history");
      return res.data.data as TestHistoryProps[];
    },
  });

  const groupedTest = testHistory?.reduce(
    (acc, test) => {
      const id = test.documentId;
      acc[id] = acc[id] || [];
      acc[id].push(test);
      return acc;
    },
    {} as Record<string, TestHistoryProps[]>,
  );

  const groupedTests = groupedTest ? Object.entries(groupedTest) : [];

  const averageGrade = useMemo(() => {
    if (!testHistory || testHistory.length === 0) return "0.0"; // Jika testHistory kosong
    const sum = testHistory.reduce(
      (acc: number, test: TestHistoryProps) => acc + (test.grade || 0),
      0,
    );
    return (sum / testHistory.length).toFixed(1);
  }, [testHistory]);

  const calculateAverageGrade = (tests: TestHistoryProps[]): string => {
    const totalGrade = tests.reduce((sum, test) => sum + test.grade, 0);
    return (totalGrade / tests.length).toFixed(1);
  };

  const totalTests = testHistory?.length;

  const pretestCount = testHistory?.filter(
    (test) => test.type.toLowerCase() === "pretest",
  ).length;
  const posttestCount = testHistory?.filter(
    (test) => test.type.toLowerCase() === "posttest",
  ).length;

  if (isPending) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6">
      
      <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <h2 className="mb-1 text-2xl font-semibold sm:mb-0">Test History</h2>
        {/* Search Test */}
      </div>

      <div className="mb-6 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groupedTests?.map(([id, tests]) => {
          return (
            <Card
              key={id}
              className="flex flex-col transition-all duration-300 hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">
                    {tests[0].document.title.charAt(0).toUpperCase() +
                      tests[0].document.title.slice(1).toLowerCase()}
                  </CardTitle>
                  <Badge variant={"default"}>
                    {tests.length} attempt{tests.length > 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-3xl font-bold">
                  {calculateAverageGrade(tests)}%
                </div>
                <p className="text-sm text-muted-foreground">Average grade</p>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/dashboard/history/document/${tests[0].documentId}/details`}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">
                    View Details <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
