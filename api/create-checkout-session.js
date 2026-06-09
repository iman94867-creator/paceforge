// POST /api/create-checkout-session
// Creates a Stripe Checkout Session and returns its URL.
// The site sends the customer to that URL to pay.
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  try {
    // Where Stripe sends the customer back to after paying.
    // Set SITE_URL in Vercel (e.g. https://paceforge.co.uk) to force your real
    // domain; otherwise we fall back to whatever host the request came from.
    const origin =
      process.env.SITE_URL ||
      req.headers.origin ||
      `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "gbp",
            unit_amount: 999, // £9.99 in pence. Change this to change the price.
            product_data: { name: "PaceForge Training Plan" },
          },
        },
      ],
      // {CHECKOUT_SESSION_ID} is replaced by Stripe with the real session id.
      success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
