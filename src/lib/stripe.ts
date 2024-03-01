import Stripe from "stripe";

// STRIPE_TEST_API_KEY STRIPE_API_KEY
export const stripe = new Stripe(process.env.STRIPE_TEST_API_KEY as string, {
  apiVersion: "2023-10-16",
  typescript: true,
});
