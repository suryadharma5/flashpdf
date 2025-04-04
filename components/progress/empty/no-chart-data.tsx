"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface NoDocumentsEmptyProps {
  title?: string;
  subtitle?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function NoChartData({
  title = "Belum ada dokumen",
  subtitle = "Tambahkan dokumen untuk mulai belajar dan melacak kemajuan Anda",
  onAction,
  actionLabel = "Tambah Dokumen",
}: NoDocumentsEmptyProps) {
  return (
    <CardContent className="flex w-full flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-6">
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mb-1 text-lg font-medium text-gray-900">{title}</h3>
        <p className="mb-6 max-w-md text-sm text-gray-500">{subtitle}</p>
        {onAction && <Button onClick={onAction}>{actionLabel}</Button>}
      </div>
    </CardContent>
  );
}
