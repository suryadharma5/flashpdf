"use client";

import ErrorPage from "@/components/dashboard/error";
import { LoadingPage } from "@/components/dashboard/loading";
import RadarChartComponent from "@/components/dashboard/progress/radar-chart";
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
import { Skeleton } from "@/components/ui/skeleton";
import { axiosInstance } from "@/lib/axios";
import { Forum, Question } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { TrendingDown, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
  Category?: {
    name: string;
  };
};

type TestScoreOvertimeProps = {
  grade: number;
  createdAt: string;
};

export default function ProgressPage() {
  const [selectedOption, setSelectedOption] = useState("option1");

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

  const {
    data: documents,
    isError: isDocumentError,
    isPending: isDocumentPending,
  } = useQuery({
    queryKey: ["fetchDocument"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/material");
      return res.data.data as DocumentProps[];
    },
  });

  const {
    data: testScoreById,
    isError: isTestScoreError,
    isPending: isTestScorePending,
    refetch,
  } = useQuery({
    queryKey: ["fetchTestScore", selectedOption],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/progress?documentId=${selectedOption}`,
      );
      return res.data.data as TestScoreOvertimeProps[];
    },
    enabled: !!documents,
  });

  const totalFlashcards = documents?.length ?? 0;

  const totalPublicFlashcards = documents?.filter((doc) => doc.isPublic).length;
  const totalPrivateFlashcards = documents?.filter(
    (doc) => !doc.isPublic,
  ).length;

  const averageGrade = useMemo(() => {
    if (!testHistory || testHistory.length === 0) return "0.0"; // Jika testHistory kosong
    const sum = testHistory.reduce(
      (acc: number, test: TestHistoryProps) => acc + (test.grade || 0),
      0,
    );
    return (sum / testHistory.length).toFixed(1);
  }, [testHistory]);

  const pretestCount = testHistory?.filter(
    (test) => test.type.toLowerCase() === "pretest",
  ).length;
  const posttestCount = testHistory?.filter(
    (test) => test.type.toLowerCase() === "posttest",
  ).length;

  const mostUsedFlashcardDeck = useMemo(() => {
    if (!testHistory || testHistory.length === 0) return "None";
    const deckCount = testHistory.reduce(
      (acc, test) => {
        acc[test.document.title] = (acc[test.document.title] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.keys(deckCount).reduce(
      (a, b) => (deckCount[a] > deckCount[b] ? a : b),
      "None",
    );
  }, [testHistory]);

  const testScoresData = useMemo(() => {
    console.log({ testScoreById });
    return (
      testScoreById?.map((test) => ({
        date: format(new Date(test.createdAt), "MMMM, dd yyyy"),
        score: test.grade,
      })) || []
    );
  }, [testScoreById]);

  const onOptionChange = (value: string) => {
    setSelectedOption(value);
    refetch();
  };

  // 🥧 Data for Flashcard Usage Breakdown (Pie Chart)
  const flashcardData = [
    { name: "Public", value: totalPublicFlashcards },
    { name: "Private", value: totalPrivateFlashcards },
  ];
  const COLORS = ["#0088FE", "#FF8042"];

  const testTypeData = [
    { name: "Pre-Test", count: pretestCount },
    { name: "Post-Test", count: posttestCount },
  ];

  const flashcardDecksData = useMemo(() => {
    if (!testHistory) return [];

    const deckCount = testHistory.reduce(
      (acc, test) => {
        acc[test.document.title] = (acc[test.document.title] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.keys(deckCount).map((title) => ({
      name: title,
      count: deckCount[title],
    }));
  }, [testHistory]);

  const { bestSubject, weakestSubject } = useMemo(() => {
    if (!testHistory || testHistory.length === 0)
      return { bestSubject: "N/A", weakestSubject: "N/A" };

    // Group test scores by document (flashcard deck)
    const subjectScores: Record<string, number[]> = {};
    testHistory.forEach((test) => {
      const title = test.document.title;
      if (!subjectScores[title]) subjectScores[title] = [];
      subjectScores[title].push(test.grade);
    });

    const subjectAverages = Object.keys(subjectScores).map((title) => ({
      title,
      avgScore:
        subjectScores[title].reduce((a, b) => a + b, 0) /
        subjectScores[title].length,
    }));

    // Find the highest and lowest scoring subjects
    const best = subjectAverages.reduce((prev, curr) =>
      curr.avgScore > prev.avgScore ? curr : prev,
    );
    const weakest = subjectAverages.reduce((prev, curr) =>
      curr.avgScore < prev.avgScore ? curr : prev,
    );

    return { bestSubject: best.title, weakestSubject: weakest.title };
  }, [testHistory]);

  useEffect(() => {
    if (documents && documents.length > 0) {
      setSelectedOption(documents[0].id);
    }
  }, [documents]);

  if (isPending || isDocumentPending) {
    return <LoadingPage />;
  }

  if (isError || isDocumentError || isTestScoreError) {
    return <ErrorPage />;
  }

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6">
      <h1 className="mb-6 text-3xl font-bold">User Statistic</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="bg-blue-100 p-3">
            <CardTitle className="flex items-center text-base font-medium text-gray-700">
              <p className="w-full text-center">Total Created Flashcards</p>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="w-full text-center text-2xl font-semibold text-gray-800">
              {totalFlashcards}{" "}
              {totalFlashcards > 1 ? "Flashcards" : "Flashcard"}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="bg-purple-100 p-3">
            <CardTitle className="flex items-center text-base font-medium text-gray-700">
              <p className="w-full text-center">Most Used Deck</p>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="w-full text-center text-2xl font-semibold text-gray-800">
              {mostUsedFlashcardDeck.replace(
                mostUsedFlashcardDeck.charAt(0),
                mostUsedFlashcardDeck.charAt(0).toUpperCase(),
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="bg-green-100 p-3">
            <CardTitle className="flex items-center text-base font-medium text-gray-700">
              <p className="w-full text-center">Average Grade</p>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="w-full text-center text-2xl font-semibold text-gray-800">
              {averageGrade}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-1 lg:grid-cols-1">
        <Card>
          <CardHeader className="relative flex flex-row items-center justify-center">
            <div className="items-center justify-center text-center">
              <CardTitle className="text-xl font-medium text-gray-800">
                Test Scores Over Time
              </CardTitle>
              <CardDescription className="text-gray-500">
                Performance tracking across document
              </CardDescription>
            </div>
            <div className="absolute right-6">
              <Select value={selectedOption} onValueChange={onOptionChange}>
                <SelectTrigger className="w-40">
                  <SelectValue>
                    {documents.find((doc) => doc.id === selectedOption)?.title}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="hover:cursor-pointer">
                  {documents.map((doc) => (
                    <SelectItem
                      key={doc.id}
                      value={doc.id}
                      className="hover:cursor-pointer"
                    >
                      {doc.title.replace(
                        doc.title.charAt(0),
                        doc.title.charAt(0).toUpperCase(),
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            {isTestScorePending ? (
              <div className="w-full">
                <Skeleton className="h-60 w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={testScoresData}>
                  <XAxis dataKey="date" tick={false} />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tickFormatter={(value) => (value % 50 === 0 ? value : "")}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#4F46E5"
                    fill="#C7D2FE"
                    dot={{
                      fill: "var(--color-desktop)",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Card className="pb-0">
          <CardHeader className="items-center">
            <CardTitle className="text-xl font-medium text-gray-800">
              Flashcard Visibility Summary
            </CardTitle>
            <CardDescription className="text-gray-500">
              Distribution of private and public flashcards
            </CardDescription>
          </CardHeader>
          <CardContent className="-mt-3 pb-0">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={flashcardData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  label
                >
                  {flashcardData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="flex flex-col items-center">
            <CardFooter className="mt-auto">
              <div className="flex w-full justify-center gap-6">
                {flashcardData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm text-gray-600">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardFooter>
          </div>
        </Card>

        <RadarChartComponent />

        <Card>
          <CardHeader className="items-center">
            <CardTitle className="text-xl font-medium text-gray-800">
              Top Tests Taken
            </CardTitle>
            <CardDescription>Your most frequently taken tests</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={flashcardDecksData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {flashcardDecksData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40"][index % 4]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="items-center">
            <CardTitle className="text-xl font-medium text-gray-800">
              Test Type Breakdown
            </CardTitle>
            <CardDescription>
              Your Pre-Test and Post-Test Activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="p-2">
              <BarChart layout="vertical" data={testTypeData}>
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="count" fill="#6ACDDF" radius={[0, 7, 7, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Best Subject
            </CardTitle>
            <Trophy className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bestSubject}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Weakest Subject
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weakestSubject}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
