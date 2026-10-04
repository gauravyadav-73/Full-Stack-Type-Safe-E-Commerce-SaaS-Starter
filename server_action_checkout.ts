"use server";

import { z } from "zod";
import Stripe from "stripe";
import { env } from "@/env";
import { redirect } from "next/navigation";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const checkoutInputSchema = z.object({
  productId: z.number().positive(),
  stripePriceId: z.string().min(1),
});

export type CheckoutInput = z.infer<typeof checkoutInputSchema>;

export async function createCheckoutSession(input: CheckoutInput): Promise<never> {
  // 1. Runtime validation of input parameters
  const validated = checkoutInputSchema.parse(input);

  // 2. Create Stripe Checkout session with strongly-typed payloads
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: validated.stripePriceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/`,
    metadata: {
      productId: validated.productId.toString(),
    },
  });

  if (!session.url) {
    throw new Error("Failed to generate Stripe checkout session URL.");
  }

  // 3. Perform server-side redirect
  redirect(session.url);
}