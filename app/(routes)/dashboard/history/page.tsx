"use client";

import ErrorPage from "@/components/dashboard/error";
import { LoadingPage } from "@/components/dashboard/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Calendar,
  ChevronRight,
  GraduationCap,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

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
  const [filterType, setFilterType] = useState("all");

  const {
    data: testHistory,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["fetchHistory"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/history");
      //   console.log(res.data.data);
      return res.data.data as TestHistoryProps[];
    },
  });

  const filteredTests = useMemo(() => {
    if (filterType === "all") return testHistory;
    return testHistory?.filter(
      (test: TestHistoryProps) => test.type.toLowerCase() === filterType,
    );
  }, [filterType, testHistory]);

  const averageGrade = useMemo(() => {
    if (!testHistory || testHistory.length === 0) return "0.0"; // Jika testHistory kosong
    const sum = testHistory.reduce(
      (acc: number, test: TestHistoryProps) => acc + (test.grade || 0),
      0,
    );
    return (sum / testHistory.length).toFixed(1);
  }, [testHistory]);

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
      <h1 className="mb-6 text-3xl font-bold">History</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageGrade}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tests Taken
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-xs text-muted-foreground">
              Pre-tests: {pretestCount} | Post-tests: {posttestCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {testHistory.length > 0
                ? Math.max(...testHistory.map((test) => test.grade))
                : "0.0"}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <h2 className="mb-1 text-2xl font-semibold sm:mb-0">Test Details</h2>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by test type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tests</SelectItem>
            <SelectItem value="pretest">Pretests</SelectItem>
            <SelectItem value="posttest">Posttests</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3 sm:gap-6">
        {filteredTests?.map((test) => (
          <Card key={test.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {test.document.title.charAt(0).toUpperCase() +
                      test.document.title.slice(1).toLowerCase()}
                  </CardTitle>
                  <CardDescription>
                    <Calendar className="mr-1 inline-block h-4 w-4" />
                    {new Date(test.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    test.type.toLowerCase() === "pretest"
                      ? "secondary"
                      : "default"
                  }
                >
                  {test.type.toLowerCase() === "pretest"
                    ? "Pre-test"
                    : "Post-test"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-2 text-3xl font-bold">{test.grade}%</div>
            </CardContent>
            <CardFooter>
              <Link
                href={`/dashboard/history/document/${test.documentId}/review/${test.id}`}
                className="w-full"
              >
                <Button variant="outline" className="w-full">
                  View Details <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
