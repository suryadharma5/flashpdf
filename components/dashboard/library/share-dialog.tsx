"use client";

import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { axiosInstance } from "@/lib/axios";
import { TForumSchema } from "@/lib/types/forum";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentTitle: string;
  documentId: string;
  queryClient: QueryClient;
}

export function ShareDialog({
  open,
  onOpenChange,
  documentTitle,
  documentId,
  queryClient,
}: ShareDialogProps) {
  const [description, setDescription] = useState("");

  const t = useTranslations("shareFlashcard");

  const createForumMutation = useMutation({
    mutationFn: async (data: TForumSchema) => {
      const res = await axiosInstance.post("/api/forum", {
        data: data,
      });

      return res.data;
    },
    onSuccess: () => {
      toast.success(t("alertSuccess"), {
        duration: 3000,
      });
      setDescription("");
      onOpenChange(false);

      queryClient.invalidateQueries({ queryKey: ["fetchDocument"] });
    },
    onError: (e: CustomError) => {
      console.error(e);
    },
  });

  const handleSubmit = () => {
    const data: TForumSchema = {
      description,
      documentId,
      title: documentTitle,
    };

    createForumMutation.mutate(data);
  };

  useEffect(() => {
    setDescription("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">{t("formTitle")}</Label>
            <Input
              id="title"
              value={documentTitle.replace(
                documentTitle.charAt(0),
                documentTitle.charAt(0).toUpperCase(),
              )}
              disabled
              readOnly
              autoFocus={false}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="public">{t("formDescription")}</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoFocus
              required
            />
          </div>
          {createForumMutation.isError && (
            <FormError
              type="error"
              message={createForumMutation.error?.response?.data.message}
            />
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            {t("cancelBtn")}
          </Button>

          <SubmitButton
            title={t("shareBtn")}
            isDisabled={createForumMutation.isPending}
            onClick={handleSubmit}
            isEmpty={!description}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
