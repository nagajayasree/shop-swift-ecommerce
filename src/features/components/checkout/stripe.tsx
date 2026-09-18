import Stripe from "stripe";

let client: Stripe | null = null;

function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    client = new Stripe(key, { apiVersion: "2026-07-29.dahlia" });
  }
  return client;
}

// Keeps existing `stripe.checkout.sessions.create(...)` call sites unchanged.
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const c = getStripe() as unknown as Record<string | symbol, unknown>;
    const value = c[prop];
    return typeof value === "function" ? value.bind(c) : value;
  },
});