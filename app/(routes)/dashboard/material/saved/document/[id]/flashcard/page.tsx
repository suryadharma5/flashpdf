"use client";

import FlashcardPage from "@/components/dashboard/material/flashcard/flashcard-page";
import { useParams } from "next/navigation";

type ParamsProps = {
  id: string;
};

export default function Page() {
  const params: ParamsProps = useParams();
  return <FlashcardPage id={params.id} />;
}
