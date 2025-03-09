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
import { Forum, Question } from "@prisma/client";
import { ChevronRight, GraduationCap, Trophy, Flame, Clock, TrendingDown, TrendingUp} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Area, AreaChart, CartesianGrid} from "recharts";
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

export default function ProgressPage() {
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
  
  console.log(documents);

  const totalFlashcards = documents?.length ?? 0;

    const totalPublicFlashcards = documents?.filter(
        (doc) => doc.isPublic,
    ).length;
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

  const highestScore = testHistory?.length ? Math.max(...testHistory.map((test) => test.grade)) : 0;

  const mostRecentTestScore = testHistory?.length ? testHistory[testHistory.length - 1].grade : "N/A";

  const testImprovementRate = useMemo(() => {
    if (!testHistory || testHistory.length < 2) return "N/A";
    const firstTest = testHistory[0]?.grade ?? 0;
    const lastTest = testHistory[testHistory.length - 1]?.grade ?? 0;
    console.log(firstTest, lastTest);
    return `${(((lastTest - firstTest) / firstTest) * 100).toFixed(1)}%`;
  }, [testHistory]);

  const mostUsedFlashcardDeck = useMemo(() => {
    if (!testHistory || testHistory.length === 0) return "None";
    const deckCount = testHistory.reduce((acc, test) => {
      acc[test.document.title] = (acc[test.document.title] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.keys(deckCount).reduce((a, b) => (deckCount[a] > deckCount[b] ? a : b), "None");
  }, [testHistory]);

  const totalStudyTime = (totalFlashcards * 10).toFixed(1); // Assuming each test takes ~10 minutes

  const streakCounter = useMemo(() => {
    if (!testHistory || testHistory.length === 0) return 0;

    const dates = testHistory.map((test) => new Date(test.createdAt).toDateString());
    const uniqueDates = [...new Set(dates)].sort();
    
    let streak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);

      if ((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24) === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [testHistory]);

  // 📊 Data for Test Scores Over Time (Line Chart)
  const testScoresData = useMemo(() => {
    return testHistory?.map((test) => ({
      date: new Date(test.createdAt).toLocaleDateString(),
      score: test.grade,
    })) || [];
  }, [testHistory]);

  // 🥧 Data for Flashcard Usage Breakdown (Pie Chart)
  const flashcardData = [
    { name: "Public", value: totalPublicFlashcards },
    { name: "Private", value: totalPrivateFlashcards },
  ];
  const COLORS = ["#0088FE", "#FF8042"];

  // 📊 Data for Test Type Distribution (Bar Chart)
  const testTypeData = [
    { name: "Pre-Test", count: pretestCount },
    { name: "Post-Test", count: posttestCount },
  ];

  // 📊 Data for Most Used Flashcard Decks (Bar Chart)
  const flashcardDecksData = useMemo(() => {
    if (!testHistory) return [];
    
    const deckCount = testHistory.reduce((acc, test) => {
      acc[test.document.title] = (acc[test.document.title] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(deckCount).map((title) => ({
      name: title,
      count: deckCount[title],
    }));
  }, [testHistory]);

  // 🆕 Compute Best & Weakest Subject
  const { bestSubject, weakestSubject } = useMemo(() => {
    if (!testHistory || testHistory.length === 0) return { bestSubject: "N/A", weakestSubject: "N/A" };

    // Group test scores by document (flashcard deck)
    const subjectScores: Record<string, number[]> = {};
    testHistory.forEach((test) => {
      const title = test.document.title;
      if (!subjectScores[title]) subjectScores[title] = [];
      subjectScores[title].push(test.grade);
    });

    // Calculate average score for each subject
    const subjectAverages = Object.keys(subjectScores).map((title) => ({
      title,
      avgScore: subjectScores[title].reduce((a, b) => a + b, 0) / subjectScores[title].length,
    }));

    // Find the highest and lowest scoring subjects
    const best = subjectAverages.reduce((prev, curr) => (curr.avgScore > prev.avgScore ? curr : prev));
    const weakest = subjectAverages.reduce((prev, curr) => (curr.avgScore < prev.avgScore ? curr : prev));

    return { bestSubject: best.title, weakestSubject: weakest.title };
  }, [testHistory]);


  if (isPending) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6">
      <h1 className="mb-6 text-3xl font-bold">User Statistic</h1>

      
      <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
        <Card><CardHeader><CardTitle>Total Flashcards Created</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{totalFlashcards}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Most Used Deck</CardTitle></CardHeader><CardContent><div className="text-xl font-bold">{mostUsedFlashcardDeck}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Highest Score</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{highestScore}%</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Average Grade</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{averageGrade}%</div></CardContent></Card>
      </div>

      
      <div className="grid gap-6 mt-6 sm:grid-cols-1 lg:grid-cols-1">
        <Card>
          <CardHeader><CardTitle>Test Scores Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={testScoresData}><XAxis dataKey="date" /><YAxis /><Tooltip /><Area type="monotone" dataKey="score" stroke="#4F46E5" fill="#C7D2FE" /></AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>  
      </div>


      <div className="grid gap-6 mt-6 sm:grid-cols-2">
      <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Most Recent Test Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostRecentTestScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Test Improvement Rate</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testImprovementRate}</div>
          </CardContent>
        </Card>

      <Card>
          <CardHeader><CardTitle>Flashcard Usage</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart><Pie data={flashcardData}dataKey="value"nameKey="name"cx="50%"cy="50%"outerRadius={80}innerRadius={50}label>{flashcardData.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Test Type Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart layout="vertical" data={testTypeData}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="name" type="category" /><Tooltip /><Bar dataKey="count" fill="#FF6384" /></BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Most Tested Flashcard</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={flashcardDecksData}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="count">{flashcardDecksData.map((_, index) => (<Cell key={`cell-${index}`} fill={["#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40"][index % 4]} />))}</Bar></BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Total Tests Taken
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-lg text-muted-foreground">
              Pre-test{(pretestCount ?? 0) > 1 ? "s" : ""}: {pretestCount} |
              Post-test{(posttestCount ?? 0) > 1 ? "s" : ""}: {posttestCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Best Subject</CardTitle>
            <Trophy className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bestSubject}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weakest Subject</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weakestSubject}</div>
          </CardContent>
        </Card>

      <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudyTime} mins</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Streak Counter</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streakCounter} days</div>
          </CardContent>
        </Card>
      </div>
      

    </div>
   
  );
}
