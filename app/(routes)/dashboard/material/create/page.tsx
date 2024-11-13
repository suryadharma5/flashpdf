"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  questionFormSchema,
  TQuestionFormSchema,
} from "@/lib/types/question-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CloudUpload, File, Trash2Icon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";

export default function CreatePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDropping, setIsDropping] = useState(false);

  const form = useForm<TQuestionFormSchema>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      document: null,
      numQuestions: undefined,
      documentTitle: "",
    },
  });

  const handleSubmit = (data: TQuestionFormSchema) => {
    try {
      console.log(data);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      form.setValue("document", acceptedFiles[0]);
      setIsDropping(false);
    }
  }, []);

  const handleRemoveFile = () => {
    form.resetField("document");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
      },
      multiple: false,
    });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Create New Flashcard</h2>
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          When you create a flashcard, a pretest will be automatically
          generated. You'll need to complete the pretest before accessing the
          flashcards to help personalize your learning experience.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Flashcard Details</CardTitle>
          <CardDescription>
            Enter the information for your new flashcard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-7 py-4 text-gray-600">
                <div className="flex flex-col space-y-2">
                  <FormField
                    control={form.control}
                    name="numQuestions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Questions</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) =>
                              // field.onChange(Number(e.target.value))
                              field.onChange(e.target.value)
                            }
                            className="col-span-3"
                            placeholder="10"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <FormField
                    control={form.control}
                    name="documentTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="col-span-3"
                            placeholder="Physics Test"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PDF File</FormLabel>
                        <FormControl>
                          <div>
                            {field.value ? (
                              <div className="flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed">
                                <File className="mr-2 h-6 w-6" />
                                <div className="flex items-center">
                                  <small className="mt-3 text-gray-500">
                                    {field.value.name}
                                  </small>
                                  <span
                                    className="ml-4 mt-3 hover:cursor-pointer"
                                    onClick={() => handleRemoveFile()}
                                  >
                                    <Trash2Icon size={15} />
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div
                                {...getRootProps()}
                                className={`flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed hover:cursor-pointer ${isDropping ? "scale-y-110 transition" : "transition"}`}
                                onDragEnter={() => setIsDropping(true)}
                                onDragLeave={() => setIsDropping(false)}
                                onDragOver={(e: React.DragEvent) => {
                                  e.preventDefault();
                                  setIsDropping(true);
                                }}
                                // onDrop={() => setIsDropping(false)}
                              >
                                <Input
                                  ref={fileInputRef}
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    field.onChange(file);
                                  }}
                                  className="col-span-3"
                                  required
                                  {...getInputProps()}
                                />
                                <CloudUpload />
                                <small className="mt-3 text-gray-500">
                                  Drag and drop files here or click to select
                                </small>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="mt-5 w-full"
              >
                Generate flashcard
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
