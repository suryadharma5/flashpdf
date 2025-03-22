"use client";

import Test from "@/components/dashboard/material/pretest/pretest";
import { useParams } from "next/navigation";

type ParamsProps = {
  id: string;
};

export default function PostTestPage() {
  const params: ParamsProps = useParams();

  return (
    <div className="h-screen w-full">
      <Test documentId={params.id} />
    </div>
  );
}
