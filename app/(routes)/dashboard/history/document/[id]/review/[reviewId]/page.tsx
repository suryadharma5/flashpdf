"use client";

import Review from "@/components/dashboard/material/review/review";
import { useParams } from "next/navigation";

type ParamsProps = {
  id: string;
  reviewId: string;
};

export default function ReviewPage() {
  const params: ParamsProps = useParams();

  return (
    <div className="h-screen w-full">
      <Review documentId={params.id} historyId={params.reviewId} />
    </div>
  );
}
