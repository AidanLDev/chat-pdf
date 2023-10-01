import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
  apiVersion: "2023-08-16", // TODO: Make this whatever stripe asks us to enter
  typescript: true,
});
