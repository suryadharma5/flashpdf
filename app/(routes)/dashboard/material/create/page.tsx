"use client";

import { LoadingPage } from "@/components/dashboard/loading";
import { ComboBoxCategory } from "@/components/dashboard/material/combo-box";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { SubmitButton } from "@/components/ui/submit-button";
import { axiosInstance } from "@/lib/axios";
import {
  questionFormSchema,
  TQuestionFormSchema,
} from "@/lib/types/question-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, CloudUpload, File, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreatePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDropping, setIsDropping] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);

  const router = useRouter();
  const t = useTranslations("create");

  const form = useForm<TQuestionFormSchema>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      document: null,
      numQuestions: "",
      documentTitle: "",
      category: "",
    },
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (data: TQuestionFormSchema) => {
      const formData = new FormData();
      formData.append("document", data.document!);
      formData.append("documentTitle", data.documentTitle);
      formData.append("numQuestions", data.numQuestions);
      formData.append("category", data.category);

      const res = await axiosInstance.post("/api/material", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    },
    onSuccess: (data) => {
      form.reset();
      router.push(
        `/dashboard/material/library/document/${data.data.id}/pretest`,
      );
      toast.success("Questions created!", {
        duration: 3000,
      });

      // router.push("/dashboard/material/pretest");
    },
    onError: (e) => {
      toast.error("Failed to create question, please try again");
      console.log("fail", e);
    },
  });

  const handleSubmit = async (data: TQuestionFormSchema) => {
    createQuestionMutation.mutate(data);
  };

  const handleFocus = () => {
    const input = inputRef.current;
    if (input) {
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length) {
        form.setValue("document", acceptedFiles[0]);
        setIsDropping(false);
      }
    },
    [form],
  );

  const handleRemoveFile = () => {
    form.resetField("document");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  if (createQuestionMutation.isPending) {
    return <LoadingPage text="AI's cooking something up for you..." />;
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-4">
      <h1 className="w-full text-start text-3xl font-bold">{t("title")}</h1>
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("warnTitle")}</AlertTitle>
        <AlertDescription>{t("warnMessage")}</AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>{t("formTitle")}</CardTitle>
          <CardDescription>{t("formDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-7 py-4 text-gray-600">
                <div className="flex flex-col space-y-2">
                  <FormField
                    control={form.control}
                    name="documentTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("formDocTitle")}</FormLabel>
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

                <div className="space-y-5 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0">
                  <div className="flex flex-col space-y-2">
                    <FormField
                      control={form.control}
                      name="numQuestions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("formNumberQuerstions")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                              value={field.value || ""}
                              ref={inputRef}
                              onFocus={handleFocus}
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
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("formCategory")}</FormLabel>
                          <FormControl>
                            <div className="col-span-3">
                              <ComboBoxCategory
                                openCombobox={openCombobox}
                                setOpenCombobox={setOpenCombobox}
                                selectedCategory={field.value}
                                setSelectedCategory={(value) => {
                                  field.onChange(value);
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("formPdf")}</FormLabel>
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
                                className={`flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed hover:cursor-pointer ${isDropping ? "scale-y-110 bg-blue-100 transition" : "transition"}`}
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
                                  {t("formPdfUpload")}
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

              <div className="mt-5">
                <SubmitButton
                  title={t("formSubmitBtn")}
                  isDisabled={createQuestionMutation.isPending}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
