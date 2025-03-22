import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export function PopoverStudyMenu({
  documentId,
  isPretest,
}: {
  documentId: string;
  isPretest: boolean;
}) {
  return (
    <TooltipProvider>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full">
            Study
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[19rem]">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Study Menu</h4>
            </div>
            <div className="grid gap-2">
              {isPretest ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full cursor-not-allowed"
                    >
                      View Flashcards
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Complete the pretest to unlock full flashcard features.
                    </p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  href={`/dashboard/material/saved/document/${documentId}/flashcard`}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">
                    <span>View Flashcards</span>
                  </Button>
                </Link>
              )}

              <Link
                href={`/dashboard/material/saved/document/${documentId}/${isPretest ? "pretest" : "posttest"}`}
              >
                <Button variant="outline" className="w-full">
                  {isPretest ? (
                    <span>Take Pretest</span>
                  ) : (
                    <span>Retake Posttest</span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}
