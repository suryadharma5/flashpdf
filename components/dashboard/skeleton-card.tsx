import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonCard = () => {
  return (
    <Card className="h-[30vh]">
      <CardHeader className="w-full">
        <Skeleton className="h-5" />
      </CardHeader>
      <CardContent className="w-full space-y-2">
        <Skeleton className="h-28" />
      </CardContent>
      <CardFooter className="w-full">
        <Skeleton className="h-6 w-full" />
      </CardFooter>
    </Card>
  );
};
