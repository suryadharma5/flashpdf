import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type PaginationProps = {
  currPage: number;
  totalPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  clickNext: () => void;
  clickPrevious: () => void;
  skipToStart: () => void;
  skipToEnd: () => void;
};

export function PaginationNavigator({
  currPage,
  totalPage,
  hasNext,
  hasPrev,
  clickNext,
  clickPrevious,
  skipToStart,
  skipToEnd,
}: PaginationProps) {
  return (
    <Pagination className="items-center justify-end gap-1">
      <div className="mr-3 whitespace-nowrap text-sm text-muted-foreground">
        Page {currPage} of {totalPage}
      </div>
      <PaginationContent>
        <PaginationItem>
          <Button size={"icon"} variant={"outline"} onClick={skipToStart}>
            <ChevronsLeft />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={clickPrevious}
            disabled={!hasPrev}
          >
            <ChevronLeft />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={clickNext}
            disabled={!hasNext}
          >
            <ChevronRight />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button size={"icon"} variant={"outline"} onClick={skipToEnd}>
            <ChevronsRight />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
