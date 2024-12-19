"use client";

import Flashcard from "@/components/dashboard/material/flashcard/flashcard";
import { useParams } from "next/navigation";

type ParamsProps = {
  id: string;
};

export default function Page() {
  const params: ParamsProps = useParams();
  return <Flashcard id={params.id} />;
}
