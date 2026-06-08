# Putting PaceForge on the web (email + Save-as-PDF)

You have two ways to go live. Start with Option A — it takes 5 minutes. Do
Option B when you want the plan emailed automatically as a PDF.

---

## Option A — Get it live now (no backend)

The whole app is a single file: **`index.html`** (or `paceforge.html`). It runs
entirely in the browser. **Save as PDF** works straight away, and **Email me**
opens the visitor's own mail app with the plan pre-filled.

Easiest host — no account, no terminal:
1. Go to **https://app.netlify.com/drop**
2. Drag the `index.html` file onto the page.
3. You get a live URL instantly. Done.

(Other free options: GitHub Pages, Cloudflare Pages, or Vercel — just upload the
file.)

---

## Option B — Real email (PDF lands in their inbox)

This deploys the **whole `paceforge-site` folder** to Vercel, which hosts the
website *and* a tiny email function on the same domain — so there's nothing
extra to wire up in the page.

### 1. Get a Resend account (free)
- Sign up at **resend.com**, create an **API key**.
- To send from your own address, add + verify your domain in Resend and set
  `FROM_EMAIL` to something like `PaceForge <plans@yourdomain.com>`.
  (For a quick test you can skip this — it'll use `onboarding@resend.dev`, which
  only delivers to the email you signed up with.)

### 2. Deploy to Vercel
```bash
npm i -g vercel
cd paceforge-site
npm install
vercel            # answer the prompts
vercel --prod     # publish
```

### 3. Add your keys
In the Vercel dashboard → your project → **Settings → Environment Variables**:
```
RESEND_API_KEY = re_xxxxxxxx
FROM_EMAIL     = PaceForge <plans@yourdomain.com>     (optional for testing)
```
Then redeploy (`vercel --prod`) so the keys take effect.

That's it. The page already calls `/api/send-email` on the same domain, so once
the key is set, the **Email me** button sends the plan as a real PDF attachment.
(If the function isn't reachable, the button automatically falls back to opening
the visitor's mail app — so it never breaks.)

---

## Using your own domain
In the Vercel project → **Settings → Domains**, add the domain you own (e.g.
`paceforge.app`) and follow the DNS instructions. Works the same on Netlify.

## Editing the app later
Everything lives in `index.html` between the `<script type="text/babel">` tags —
it's the same code you saw in the preview. The line near the top:
```js
const EMAIL_API = "/api/send-email";
```
controls email: keep it for Option B, or set it to `""` to force the
open-your-mail-app behaviour.

## Good to know
- The plan is built right in the browser (running-science engine), so the site
  needs no API key just to generate plans — keys are only for sending email.
- Keep your `RESEND_API_KEY` in Vercel's env vars only, never in `index.html`.
- Consider adding a simple captcha on the email field before launch so nobody
  burns through your free email quota.
