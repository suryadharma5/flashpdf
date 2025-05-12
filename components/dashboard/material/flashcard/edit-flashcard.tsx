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
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/axios";
import {
  editFlashcardSchema,
  TEditFlashcardSchema,
} from "@/lib/types/question-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type EditFlashcardDialogProps = {
  id: string;
  isEditDialogOpen: boolean;
  setKeyPoint: (keyPoint: string) => void;
  setExplanation: (explanation: string) => void;
  defaultValues: TEditFlashcardSchema;
  setIsEditDialogOpen: (open: boolean) => void;
};

type EditFlashcardResponse = {
  keyPoint: string;
  explanation: string;
};

export const EditFlashcardDialog = ({
  id,
  isEditDialogOpen,
  setIsEditDialogOpen,
  defaultValues,
  setKeyPoint,
  setExplanation,
}: EditFlashcardDialogProps) => {
  const form = useForm<TEditFlashcardSchema>({
    resolver: zodResolver(editFlashcardSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data: TEditFlashcardSchema) => {
    console.log(data);
    if (Object.keys(form.formState.dirtyFields).length === 0) {
      setIsEditDialogOpen(false);
      return;
    }

    const allValues = form.getValues();

    const changedData = Object.fromEntries(
      Object.entries(allValues).filter(
        ([key]) =>
          form.formState.dirtyFields[key as keyof TEditFlashcardSchema],
      ),
    );

    updateFlashcardMutation.mutate(changedData);
  };

  const updateFlashcardMutation = useMutation({
    mutationFn: async (data: TEditFlashcardSchema) => {
      const res = await axiosInstance.patch(
        `/api/material?type=flashcard&flashcardId=${id}`,
        data,
      );
      return res.data.data as EditFlashcardResponse;
    },
    onSuccess: (res) => {
      setKeyPoint(res.keyPoint);
      setExplanation(res.explanation);
      toast.success("Flashcard updated successfully");
      setIsEditDialogOpen(false);
    },
    onError: () => {
      toast.error(`Error updating flashcard`);
    },
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Flashcard</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="keyPoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poin Utama</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan poin utama" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Penjelasan</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Masukkan penjelasan"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2 rounded-lg border border-amber-200 bg-amber-50 p-2">
              <AlertCircle className="h-5 w-5 text-amber-800" />
              <small className="text-xs text-amber-800">
                Perubahan pada flashcard ini juga akan terlihat oleh pengguna
                lain yang sudah menyimpannya.
              </small>
            </div>

            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={
                  !form.formState.isDirty || updateFlashcardMutation.isPending
                }
              >
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
