"use client";

import ErrorPage from "@/components/dashboard/error";
import { LoadingPage } from "@/components/dashboard/loading";
import { ComboBoxCategory } from "@/components/dashboard/material/combo-box";
import { ConfirmationDialog } from "@/components/dashboard/material/confirmation-dialog";
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
import { axiosInstance } from "@/lib/axios";
import {
  questionFormSchema,
  TQuestionFormSchema,
} from "@/lib/types/question-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle, CloudUpload, File, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

type CategoryProps = {
  id: string;
  name: string;
};

export default function CreatePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDropping, setIsDropping] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] =
    useState<TQuestionFormSchema | null>(null);

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

  const { data: categories, isError } = useQuery({
    queryKey: ["fetchCategories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/category");
      const categories = res.data.data as CategoryProps[];
      return categories;
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

      return res.data.data;
    },
    onSuccess: (data) => {
      form.reset();
      setFormDataToSubmit(null);
      toast.success(t("alertSuccess"), {
        duration: 3000,
      });
      router.push(`/dashboard/material/library/document/${data.id}/pretest`);
    },
    onError: (e) => {
      toast.error(t("alertFailed"));
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

  const handleCheckFieldsBeforeSubmit = async () => {
    const isValid = await form.trigger(); // validasi semua fields

    if (isValid) {
      const data = form.getValues(); // Ambil semua value form
      setFormDataToSubmit(data);
      setShowConfirmation(true); // kalau valid, tampilkan popup
    }
  };

  const handleRemoveFile = () => {
    form.resetField("document");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleDownloadFile = () => {
    const file = form.getValues("document");
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank", "noopener,noreferrer");
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
    return <LoadingPage text="AI's cooking something up for you" />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-4">
      <h1 className="w-full text-start text-3xl font-bold">{t("title")}</h1>
      <Alert className="border-amber-100 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-800">{t("warnTitle")}</AlertTitle>
        <AlertDescription className="text-amber-800">
          {t("warnMessage")}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>{t("formTitle")}</CardTitle>
          <CardDescription>{t("formDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Form {...form}>
            <form>
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
                                <File className="h-6 w-6" />
                                <div className="flex flex-col items-center">
                                  <div className="mt-3 flex items-center">
                                    <button
                                      type="button"
                                      className="flex items-center text-blue-500 hover:text-blue-700 hover:underline focus:outline-none"
                                      onClick={handleDownloadFile}
                                    >
                                      <small className="text-gray-800">
                                        {field.value.name}
                                      </small>
                                    </button>
                                    <button
                                      type="button"
                                      className="ml-3 text-gray-500 hover:text-red-500 focus:outline-none"
                                      onClick={handleRemoveFile}
                                    >
                                      <Trash2Icon size={15} />
                                    </button>
                                  </div>
                                  <small className="mt-1 text-xs text-gray-500">
                                    {t("fileVeriication")}
                                  </small>
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
                <Button
                  disabled={createQuestionMutation.isPending}
                  className="flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-800"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCheckFieldsBeforeSubmit();
                  }}
                >
                  <ClipLoader
                    color="white"
                    size={15}
                    className="mr-1"
                    loading={createQuestionMutation.isPending}
                  />
                  <p>
                    {createQuestionMutation.isPending
                      ? "Loading..."
                      : t("formSubmitBtn")}
                  </p>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => {
          if (formDataToSubmit) {
            handleSubmit(formDataToSubmit);
          }
          setShowConfirmation(false);
        }}
        details={{
          title: form.getValues("documentTitle"),
          numberOfCards: form.getValues("numQuestions"),
          category: categories?.find(
            (category) => category.id === form.getValues("category"),
          )?.name,
          pdfFileName: form.getValues("document")?.name,
        }}
      />
    </div>
  );
}
