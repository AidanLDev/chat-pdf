import { UserButton, auth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, LogInIcon } from "lucide-react";
import Center from "@/components/layout/Center";
import FileUpload from "@/components/FileUpload";
import { checkSubscription } from "@/lib/subscription";
import SubscriptionButton from "@/components/SubscriptionButton";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  const isPro = await checkSubscription();

  let allChats;
  let firstChat;
  let numberOfChats;

  if (userId) {
    allChats = await db.select().from(chats).where(eq(chats.userId, userId));
    if (allChats) {
      firstChat = allChats[0];
      numberOfChats = allChats.length;
    }
  }

  const disableChat = numberOfChats && numberOfChats >= 3 && !isPro;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100">
      <Center>
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with any PDF</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="flex mt-2">
            {isAuth && firstChat && (
              <Link href={`/chat/${firstChat.id}`}>
                <Button>
                  Go to Chats <ArrowRight className="ml-2" />
                </Button>
              </Link>
            )}
            <div className="ml-3">
              <SubscriptionButton isPro={isPro} />
            </div>
          </div>
          <p className="max-w-xl mt-1 text-lg text-slate-600">
            Join millions of students. researchers and professionals to
            instantly answer questions and understand research with AI{" "}
          </p>
          <div className="w-full mt-4">
            {isAuth ? (
              disableChat ? (
                <h1>Free tier supports 3 documents, please ugrade to pro</h1>
              ) : (
                <FileUpload />
              )
            ) : (
              <Link href="sign-in">
                <Button>
                  Login to get started <LogInIcon className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Center>
    </div>
  );
}
