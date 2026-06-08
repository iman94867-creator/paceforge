// POST /api/send-email   Body: { to, subject, filename, pdfBase64 }
// Emails the plan PDF as an attachment using Resend.
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  const { to, subject, filename, pdfBase64 } = req.body || {};
  if (!to || !pdfBase64) return res.status(400).json({ error: "Missing 'to' or 'pdfBase64'" });

  try {
    const { data, error } = await resend.emails.send({
      // FROM_EMAIL must be on a domain verified in your Resend account,
      // e.g. "PaceForge <plans@yourdomain.com>".
      // For first tests, "onboarding@resend.dev" works but only delivers to
      // the email address you signed up to Resend with.
      from: process.env.FROM_EMAIL || "PaceForge <onboarding@resend.dev>",
      to: [to],
      subject: subject || "Your PaceForge training plan",
      html: "<p>Your personalised training plan is attached as a PDF. Good luck chasing that PB! 🏃</p>",
      attachments: [{ filename: filename || "paceforge-plan.pdf", content: pdfBase64 }],
    });
    if (error) return res.status(502).json({ error });
    return res.status(200).json({ ok: true, id: data?.id });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
