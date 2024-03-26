import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import ChatComponent from "@/components/ChatComponent";
import React from "react";
import { checkSubscription } from "@/lib/subscription";

type Props = {
  params: {
    chatId: string;
  };
};

export default async function ChatPage({ params: { chatId } }: Props) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const isPro = await checkSubscription();
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats || !_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));

  return (
    <div className="flex max-h-screen overflow-auto">
      <div className="md:flex md:w-full max-h-screen overflow-auto">
        <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
        <div className="max-h-screen p-4 overflow-auto flex-[5]">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        <div className="flex-[3] border-1-4 border-l-slate-200">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
}
