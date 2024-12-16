import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type QuestionProps = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type QuestionNavigatorProps = {
  mockQuestions: QuestionProps[];
  currentQuestion: number;
  userAnswers: string[];
  setCurrentQuestion: (index: number) => void;
  flaggedQuestions: Set<any>;
};

export const QuestionNavigator = ({
  mockQuestions,
  currentQuestion,
  userAnswers,
  setCurrentQuestion,
  flaggedQuestions,
}: QuestionNavigatorProps) => {
  return (
    <Card className="mb-4 w-full shadow-lg md:mb-0 md:w-64">
      <CardHeader className="rounded-t-lg bg-primary text-primary-foreground">
        <CardTitle className="text-center text-xl font-bold">
          Question Navigator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-fit w-full rounded-md border px-2 py-4">
          <div className="grid grid-cols-5 justify-items-center gap-2 md:grid-cols-3">
            {mockQuestions.map((_, index) => (
              <Button
                key={index}
                variant={"outline"}
                className={`h-10 w-10 p-0 ${
                  userAnswers[index] !== null
                    ? "bg-primary text-primary-foreground"
                    : ""
                } ${
                  flaggedQuestions.has(index)
                    ? "border-2 border-destructive"
                    : ""
                } ${currentQuestion === index ? "border border-black" : ""}`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
