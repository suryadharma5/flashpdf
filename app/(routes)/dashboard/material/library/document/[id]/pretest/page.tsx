"use client";

import Pretest from "@/components/dashboard/material/pretest/pretest";
import { useParams } from "next/navigation";

type ParamsProps = {
  id: string;
};

export default function PretestPage() {
  const params: ParamsProps = useParams();

  return (
    <div className="h-screen w-full">
      <Pretest documentId={params.id} />
    </div>
  );
}
