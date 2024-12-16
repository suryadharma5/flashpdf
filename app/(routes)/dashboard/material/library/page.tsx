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
import { axiosInstance } from "@/lib/axios";
import EmptyImage from "@/public/empty.svg";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNowStrict } from "date-fns";
import {
  AlertCircle,
  Clock9,
  FileText,
  NotebookPen,
  Pencil,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type DocumentProps = {
  id: string;
  createdAt: string;
  title: string;
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
    <>
      {documents.length > 0 ? (
        documents.map((data, idx) => (
          <div
            className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3"
            key={idx}
          >
            <Card key={data.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>
                      {data.title.replace(
                        data.title.charAt(0),
                        data.title.charAt(0).toUpperCase(),
                      )}
                    </CardTitle>
                    <CardDescription>category</CardDescription>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-yellow-100 text-yellow-500"
                  >
                    <>
                      <AlertCircle className="mr-1 h-4 w-4" />
                      Unfinished Pretest
                    </>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col justify-center gap-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock9 size={15} />
                  <p className="text-xs">
                    {formatDistanceToNowStrict(data.createdAt)} ago
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <div className="flex w-full justify-between">
                  <Button variant="outline" size="sm">
                    <NotebookPen className="h-4 w-4" />
                    Review
                  </Button>
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>

                <Link
                  href={`/dashboard/material/library/document/${data.id}/pretest`}
                  className="mt-4 w-full"
                >
                  <Button variant="default" size="sm" className="w-full">
                    <FileText className="h-4 w-4" />
                    Take Pre-test
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        ))
      ) : (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center">
          <Image src={EmptyImage} alt="empty image" width={250} height={250} />
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
    </>
  );
}
