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
    <div className="w-screen min-h-screen bg-background">
      <Center>
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center animate-fly-in-from-top transition-all duration-1500 ease-in-out">
            <h1 className="mr-3 text-7xl font-semibold text-primary animate-glow animation text-stroke">
              Chat with any PDF
            </h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="flex mt-2">
            {isAuth && firstChat && (
              <>
                <Link href={`/chat/${firstChat.id}`}>
                  <Button>
                    Go to Chats <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <div className="ml-3">
                  <SubscriptionButton isPro={isPro} />
                </div>
              </>
            )}
          </div>
          <div className="w-full mt-4">
            {isAuth ? (
              disableChat ? (
                <h1>Free tier supports 3 documents, please upgrade to pro</h1>
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
