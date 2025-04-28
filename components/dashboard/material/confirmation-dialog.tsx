"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { categoryColors } from "@/lib/util/category";
import { AlertCircle, Check, X } from "lucide-react";
import { useTranslations } from "use-intl";

interface FlashcardDetails {
  title: string;
  numberOfCards: string;
  category?: string;
  pdfFileName?: string;
}

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  details: FlashcardDetails;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  details,
}: ConfirmationDialogProps) {
  const t = useTranslations("create");
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {t("alertTitle")}
          </DialogTitle>
          <DialogDescription>{t("alertDescription")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-semibold">{t("flashcardDetail")}</h3>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("flashcardTitle")}
                </span>
                <span className="text-left text-sm font-medium">
                  {details.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("flashcardCount")}
                </span>
                <span className="text-left text-sm font-medium">
                  {details.numberOfCards} flashcard
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("flashcardCategory")}
                </span>
                <span className="text-left text-sm">
                  <Badge
                    className={`${categoryColors[details.category ?? "others"]} w-fit`}
                    variant={"default"}
                  >
                    {details.category?.replace(
                      details.category.charAt(0),
                      details.category.charAt(0).toUpperCase(),
                    ) || "Tidak dipilih"}
                  </Badge>
                </span>
              </div>
              {details.pdfFileName && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("flashcardFile")}
                  </span>
                  <span className="truncate text-left text-sm font-medium">
                    {details.pdfFileName}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <small className="text-xs text-amber-800">
              {t("alertMessage")}
            </small>
          </div>
        </div>
        <DialogFooter className="flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            {t("alertCancel")}
          </Button>
          <Button onClick={onConfirm}>
            <Check className="mr-2 h-4 w-4" />
            {t("alertContinue")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
