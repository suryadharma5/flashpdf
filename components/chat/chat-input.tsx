"use client";

import { Textarea } from "@/components/ui/textarea";
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea";
import { cn } from "@/lib/utils";
import { ChatRequestOptions } from "ai";
import { CircleStop, CornerRightUp } from "lucide-react";
import { Dispatch, SetStateAction, useCallback } from "react";

const MIN_HEIGHT = 56;

type AIInputProps = {
  input: string;
  isLoading: boolean;
  setInput: Dispatch<SetStateAction<string>>;
  stop: () => void;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
};

export default function AIInput({
  input,
  isLoading,
  setInput,
  stop,
  handleSubmit,
}: AIInputProps) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: 200,
  });

  const submitInput = useCallback(() => {
    console.log(input);
    handleSubmit();
    adjustHeight(true);
  }, [adjustHeight, input]);

  return (
    <div className="w-full py-4">
      <div className="relative mx-auto w-full max-w-xl">
        <Textarea
          id="ai-input-05"
          placeholder="Ask me anything!"
          className="min-h-[40px] w-full max-w-xl resize-none text-wrap rounded-3xl border-none bg-black/5 py-4 pl-4 pr-12 text-sm text-black placeholder:text-black/70"
          ref={textareaRef}
          value={input}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              submitInput();
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            setInput(e.target.value);
            adjustHeight();
          }}
        />
        {isLoading ? (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-black/5 px-1 py-1"
            type="button"
            onClick={(event) => {
              event.preventDefault();
              stop();
            }}
          >
            <CircleStop className="size-4 text-black opacity-100 transition-opacity" />
          </button>
        ) : (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-black/5 px-1 py-1 dark:bg-white/5"
            type="button"
            onClick={submitInput}
          >
            <CornerRightUp
              className={cn("h-4 w-4 transition-opacity dark:text-white", {
                "opacity-100": input,
                "opacity-30": !input,
              })}
            />
          </button>
        )}
      </div>
    </div>
  );
}
