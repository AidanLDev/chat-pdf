"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle, Menu, X } from "lucide-react";
import { useIsMobile } from "breakpoint-hooks";
import { cn } from "@/lib/utils";
import SubscriptionButton from "./SubscriptionButton";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
};

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  const toggleSidebar = () => setIsOpen((curState) => !curState);
  return (
    <div className="flex-[1] md:max-w-xs w-full text-gray-200 bg-gray-900 pt-4">
      {isMobile && isOpen && (
        <X className="ml-4 pb-4 h-12 w-12" onClick={() => toggleSidebar()} />
      )}
      {isMobile && !isOpen && (
        <Menu className="ml-4 pb-4 h-12 w-12" onClick={() => toggleSidebar()} />
      )}
      {isOpen && (
        <div className="w-full h-screen p-4 text-gray-200 bg-gray-900">
          {/* TODO: Add transition so it looks nice when opening/closing */}
          <Link href="/">
            <Button className="w-full border-dashed border-white border text-primary-foreground">
              <PlusCircle className="mr-2 w-4 h-4" />
              New Chat
            </Button>
          </Link>

          <div className="flex flex-col gap-2 mt-4">
            {chats.map((chat) => (
              <Link key={chat.id} href={`/chat/${chat.id}`}>
                <div
                  className={cn(
                    "rounded-lg p-3 text-slate-300 flex items-center",
                    {
                      "bg-blue-600 text-white": chat.id === chatId,
                      "hover:text-white": chat.id !== chatId,
                    }
                  )}
                >
                  <MessageCircle className="mr-2" />
                  <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                    {chat.pdfName}
                  </p>
                </div>
              </Link>
            ))}
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <Link href="/">
                  <Button className="border text-primary-foreground">
                    Home
                  </Button>
                </Link>
                <SubscriptionButton isPro={isPro} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSideBar;
