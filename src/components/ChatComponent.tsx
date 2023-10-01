"use client";
import React from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { SendIcon } from "lucide-react";
import MessageList from "./MessageList";

type Props = {};

export default function ChatComponent({}: Props) {
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: '/api/chat'
  });

  return (
    <div className="relative max-h-screen overflow-scroll">
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>
      <MessageList messages={messages} />

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question"
            className="w-full"
          />
          <Button className="bg-blue-600 ml-2">
            <SendIcon className="h-4 w-4 " />
          </Button>
        </div>
      </form>
    </div>
  );
}
