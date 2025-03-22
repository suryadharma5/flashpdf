"use client";

import { LoadingPage } from "@/components/dashboard/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuestions } from "@/hooks/useQuestion";
import { Check, Edit, Pencil } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ParamsProps = {
  id: string;
};

export default function EditDocumentPage() {
  const params: ParamsProps = useParams();
  const documentId = params.id;

  const { questions, isLoading, isError, isSuccess, error } =
    useQuestions(documentId);

  if (isError) {
    console.error(error);

    setTimeout(() => {
      redirect("/dashboard/home");
    }, 3000);

    toast.error("Oops, something went wrong.\n Redirecting to home page", {
      duration: 3000,
    });
  }

  const [isEditting, setIsEditting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  // const [options , setOptions] =

  return (
    <div className="flex min-h-screen w-full flex-col items-start justify-center space-y-4 bg-background p-4 text-foreground md:flex-row md:space-x-4 md:space-y-0">
      {isLoading ? (
        <LoadingPage />
      ) : isSuccess ? (
        <div className="flex w-full flex-col items-center justify-center space-y-4">
          <Card className="w-full max-w-4xl shadow-lg">
            <CardHeader className="rounded-t-md">
              <CardTitle>
                <div className="flex items-center">
                  <div className="mr-2 rounded-sm bg-primary p-1">
                    <Edit className="text-white" />
                  </div>
                  <p>Edit question{questions.length > 1 ? "s" : ""}</p>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="mt-3 space-y-6">
              {questions.map((question, idx) => (
                <div className="rounded-lg border px-6 pb-6 pt-4" key={idx}>
                  <div className="flex items-center justify-start space-x-5">
                    {isEditting ? (
                      <Input
                        value={currentQuestion}
                        onChange={(e) => setCurrentQuestion(e.target.value)}
                        className="flex-1 text-xl font-semibold"
                        autoFocus
                      />
                    ) : (
                      <h2 className="flex-1 text-xl font-semibold">
                        {idx + 1}. {question.question}
                      </h2>
                    )}
                    <Button
                      size={"icon"}
                      onClick={() => {
                        setIsEditting(!isEditting);
                        setCurrentQuestion(question.question);
                      }}
                    >
                      {isEditting ? <Check /> : <Pencil />}
                    </Button>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {questions[idx]?.options.map((option, index) => {
                      return (
                        <div
                          key={index}
                          className={`h-auto w-full justify-start overflow-hidden whitespace-normal break-words rounded-md border px-2 py-6 text-left text-foreground transition-all`}
                        >
                          <span className={`max-w-full text-sm`}>{option}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>

            {/* <CardFooter className="grid w-full max-w-4xl grid-cols-2 gap-4">
              <Link className="w-full" href="/dashboard/history">
                <Button variant="outline" className="w-full">
                  View history
                </Button>
              </Link>
              <Link
                className="w-full"
                href={`/dashboard/material/library/document/${documentId}/flashcard`}
              >
                <Button className="w-full">View flashcards</Button>
              </Link>
            </CardFooter> */}
          </Card>
        </div>
      ) : (
        <div>Empty page</div>
      )}
    </div>
  );
}
