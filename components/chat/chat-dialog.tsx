import { MessageBlock } from "@/components/chat/message";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChatRequestOptions, Message } from "ai";
import { BotMessageSquare } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import AIInput from "./chat-input";

type ChatDialogProps = {
  messages: Message[];
  input: string;
  isLoading: boolean;
  setInput: Dispatch<SetStateAction<string>>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
  stop: () => void;
};

export const ChatDialog = ({
  messages,
  input,
  isLoading,
  setInput,
  handleSubmit,
  stop,
}: ChatDialogProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="fixed bottom-7 right-7 rounded-full bg-primary p-4 text-white shadow-lg transition hover:scale-110 hover:cursor-pointer hover:bg-gray-700">
          <BotMessageSquare className="h-6 w-6" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <div className="flex h-full flex-col">
          <SheetTitle className="mb-4 text-2xl font-bold">Ask AI</SheetTitle>
          <ScrollArea className="mb-4 flex-grow pr-7">
            <div className="space-y-4">
              <MessageBlock messages={messages} />
            </div>
          </ScrollArea>

          <AIInput
            input={input}
            isLoading={isLoading}
            setInput={setInput}
            handleSubmit={handleSubmit}
            stop={stop}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
