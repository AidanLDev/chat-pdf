import Stripe from "stripe";

// STRIPE_TEST_API_KEY STRIPE_API_KEY
export const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
  apiVersion: "2023-08-16", // TODO: Make this whatever stripe asks us to enter
  typescript: true,
});
