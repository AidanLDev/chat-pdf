"use client";
import React from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { SendIcon } from "lucide-react";
import MessageList from "./MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";

type Props = { chatId: number };

export default function ChatComponent({ chatId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      className="flex flex-col gap-4 max-h-screen overflow-auto"
      id="message-container"
    >
      <div className="sticky top-0 inset-x-0 p-2 bg-background h-fit">
        <h3 className="text-xl font-bold text-primary">Chat</h3>
      </div>
      <MessageList messages={messages} isLoading={isLoading} />

      <div className="flex flex-col justify-between h-screen">
        <form
          onSubmit={handleSubmit}
          className="inset-x-0 px-2 pb-8 mt-auto bg-background inline-block"
        >
          <div className="flex">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask any question"
              className="w-full text-primary"
            />
            <Button className="bg-blue-600 ml-2 text-primary">
              <SendIcon className="h-4 w-4 " />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
