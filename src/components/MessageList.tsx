import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader } from "lucide-react";
import React from "react";

type Props = {
  messages: Message[];
  isLoading: boolean;
};

const MessageList = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return <div className="absolute top-1/2 left-1/2 translate-x-1/2 translate-y-1/2">
      <Loader className="w-6 h-6 animate-spin" />
    </div>
  }
  if (!messages) return <></>;
  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message) => (
        <div key={message.id}>
          <div
            className={cn("flex", {
              "justify-end": message.role === "user",
              "justify-start": message.role === "system",
            })}
          >
            <div
              className={cn(
                "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
                {
                  "bg-blue-600 text-white": message.role === "user",
                }
              )}
            >
              <p className="">{message.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
