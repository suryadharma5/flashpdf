import { Message } from "ai";
import { Bot, Check, CircleUser, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MessageProps = {
  messages: Message[];
};

export const MessageBlock = ({ messages }: MessageProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" }); //Use scrollIntoView to automatically scroll to my ref
    }
  }, [messages.length]);

  const [copied, setCopied] = useState<boolean[]>(messages.map(() => false));

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        const updatedCopied = [...copied];
        updatedCopied[idx] = true;
        setCopied(updatedCopied);

        setTimeout(() => {
          const resetCopied = [...updatedCopied];
          resetCopied[idx] = false;
          setCopied(resetCopied);
        }, 500);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <>
      {messages.map((message, idx, row) => (
        <div
          className={`flex w-full items-end ps-2 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
          key={idx}
          ref={idx + 1 === row.length ? scrollRef : null}
        >
          <div className="flex w-fit items-start space-x-4">
            {message.role === "user" ? (
              <>
                <div className="w-3/4 flex-1 rounded-lg border border-gray-200 p-3">
                  <div className="text-end text-sm">{message.content}</div>
                </div>
                <CircleUser className="mt-1 h-5 w-5 text-gray-500" />
              </>
            ) : (
              <div className="flex-col">
                <div className="flex w-fit items-start space-x-4">
                  <Bot className="mt-1 h-5 w-5 text-gray-500" />
                  <div
                    className={`w-3/4 flex-1 rounded-lg border border-gray-200 p-3`}
                  >
                    <div className={`text-sm`}>{message.content}</div>
                  </div>
                </div>
                <div
                  className="mt-1 flex items-center space-x-4 text-xs font-light text-gray-500"
                  onClick={() => handleCopy(message.content, idx)}
                >
                  <div className="h-5 w-5"></div>
                  <div
                    className={`flex w-fit items-center rounded-md px-1 py-2 transition hover:cursor-pointer hover:bg-gray-200/25 ${copied[idx] ? "scale-110" : ""} transition`}
                  >
                    {copied[idx] ? (
                      <>
                        <Check className="mr-2 h-3 w-3" />
                        <p>Copied</p>
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-3 w-3" />
                        <p>Copy</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};
