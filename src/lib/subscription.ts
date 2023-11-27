import { auth } from "@clerk/nextjs";
import { db } from "./db";
import { userSubscriptions } from "./db/schema";
import { eq } from "drizzle-orm";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const MONTH_IN_MS = DAY_IN_MS * 31;

export const checkSubscription = async function () {
  const { userId } = await auth();
  if (!userId) {
    return false;
  }

  const _userSubscriptions = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId));

  if (!_userSubscriptions[0]) {
    return false;
  }

  const userSubscription = _userSubscriptions[0];

  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + MONTH_IN_MS >
      Date.now();

  return !!isValid;
};
