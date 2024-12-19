"use client";

import ErrorPage from "@/components/dashboard/error";
import { LoadingPage } from "@/components/dashboard/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import EmptyImage from "@/public/empty.svg";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import {
  AlertCircle,
  CircleAlert,
  CircleCheckBig,
  Clock9,
  Pencil,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type HistoryProps = {
  type: string;
};

type DocumentProps = {
  id: string;
  createdAt: string;
  title: string;
  History: HistoryProps[];
};

export default function Page() {
  const { data, isError, isPending } = useQuery({
    queryKey: ["fetchDocument"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/material");
      return res.data;
    },
  });

  if (isPending) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  const documents: DocumentProps[] = data.data;

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-6">
      <h1 className="mb-6 text-3xl font-bold">Your Documents</h1>
      <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.length > 0 ? (
          documents.map((data, idx) => (
            <Card
              key={data.id}
              className="flex w-full flex-col transition-all duration-300 hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex max-w-full items-start justify-between">
                  <div className="max-w-full flex-1">
                    <CardTitle className="overflow-hidden truncate">
                      {data.title
                        .replace(
                          data.title.charAt(0),
                          data.title.charAt(0).toUpperCase(),
                        )
                        .slice(0, 20)}

                      {data.title.length > 20 ? "..." : ""}
                    </CardTitle>
                    <CardDescription>
                      <div className="mt-2 flex items-center gap-2">
                        <Clock9 size={15} />
                        <p className="text-xs">
                          {formatDistanceToNowStrict(data.createdAt)} ago
                        </p>
                      </div>
                    </CardDescription>
                  </div>
                  {data.History.length > 0 ? (
                    <Badge
                      variant="default"
                      className="ml-1 bg-green-100 text-green-500"
                    >
                      <CircleCheckBig className="mr-1 h-4 w-4" />
                    </Badge>
                  ) : (
                    <Badge
                      variant="default"
                      className="ml-1 bg-yellow-100 text-yellow-500"
                    >
                      <AlertCircle className="mr-1 h-4 w-4" />
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardFooter className="flex flex-wrap gap-2">
                {data.History.length > 0 ? (
                  <div className="mb-2 flex w-full gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:border-yellow-500 hover:bg-white"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:border-destructive hover:bg-white"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                ) : (
                  <div className="mb-2 flex rounded-md bg-yellow-100 px-3 py-1 text-yellow-800 dark:bg-yellow-900">
                    <CircleAlert className="mr-2 h-4 w-4" />
                    <p className="text-xs dark:text-yellow-200">
                      Complete the pretest to unlock full flashcard features.
                    </p>
                  </div>
                )}

                <Link
                  className="w-full"
                  href={`http://localhost:3000/dashboard/material/library/document/${data.id}/flashcard`}
                >
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={data.History.length <= 0}
                  >
                    View Flashcards
                  </Button>
                </Link>
                <Link
                  href={`/dashboard/material/library/document/${data.id}/pretest`}
                  className="w-full"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    Take {data.History[idx] ? "Post-test" : "Pre-test"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="flex h-[80vh] w-full flex-col items-center justify-center">
            <Image
              src={EmptyImage}
              alt="empty image"
              width={250}
              height={250}
            />
            <p className="mt-12 text-center text-2xl font-light">
              You don't have any flashcard yet
            </p>
            <Link href="/dashboard/material/create">
              <Button className="mt-4" type="button">
                Create now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
