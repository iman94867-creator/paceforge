// GET /api/verify-session?session_id=cs_xxx   (also accepts POST { session_id })
// Asks Stripe whether a Checkout Session was actually paid.
// Returns { paid: true } only if Stripe confirms payment — this is what makes
// the unlock secure (the ?paid=true trick no longer works).
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const sessionId =
    (req.query && req.query.session_id) ||
    (req.body && req.body.session_id);

  if (!sessionId) return res.status(400).json({ paid: false, error: "Missing session_id" });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid";
    return res.status(200).json({ paid });
  } catch (e) {
    // Unknown / invalid id, or Stripe error: treat as not paid.
    return res.status(200).json({ paid: false, error: String(e) });
  }
}
