import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

type InputModalProps = {
  title: string;
  buttonTitle: string;
  isDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const InputModal = ({
  title,
  buttonTitle,
  isDialogOpen,
  onOpenChange,
}: InputModalProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<TQuestionFormSchema>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      document: undefined,
      numQuestions: 0,
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

  /* MARK: clear form when dialog is closed */
  useEffect(() => {
    if (!isDialogOpen) {
      form.reset();
    }
  }, [isDialogOpen, form]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-7 py-4 text-gray-600">
              <div className="flex flex-col space-y-2">
                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PDF File</FormLabel>
                      <FormControl>
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
                  name="numQuestions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Questions</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
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
            </div>

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {buttonTitle}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
