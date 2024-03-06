import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// TODO: Once we have the /account page set-up, update return_url to go to /account
const returnUrl = process.env.NEXT_BASE_URL + "/";

//  /api/stripe
export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return new NextResponse("unathorised", { status: 401 });
    }

    const _userSubscriptions = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId));
    if (_userSubscriptions[0] && _userSubscriptions[0].stripeCustomerId) {
      const subscriptionId = _userSubscriptions[0].stripeSubscriptionId;
      // https://docs.stripe.com/api/subscriptions/cancel
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: _userSubscriptions[0].stripeCustomerId,
        return_url: returnUrl,
      });
      return NextResponse.json({ url: stripeSession.url });
    }

    // User's first time trying to subscribe
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: returnUrl,
      cancel_url: returnUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user?.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "ChatPDF Pro",
              description: "Unlimited PDF sessions!",
            },
            unit_amount: 1000,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
