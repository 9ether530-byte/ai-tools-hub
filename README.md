# NativeLayer AI Tools Hub — Phase 1

Practical AI how-to guides for small business owners, built as a content hub that can
apply for Google AdSense once it has a real domain, traffic, and indexing. Phase 1 is a
complete local build. Nothing is deployed, and no AdSense account exists.

## What was built

- **Stack:** Next.js 15.5.29 (App Router) + React 19, Node 24. Static generation for all
  content pages; API routes for forms. Deploy-ready for Vercel free tier (not deployed).
- **Content:** 12 original articles (862–953 words each), one per keyword — the first 12
  keywords from `~/workspace/shorts-engine/config/keywords.txt` (read only, not modified).
  Each article has an intro, 5 steps, pitfalls, FAQ, and related-article links. No income
  claims, no invented tool names or prices, no fake reviews or testimonials.
- **Pages:** home (hero, latest articles, newsletter signup), `/articles`,
  `/articles/[slug]` (12 pages), `/about` (NativeLayer, sole proprietorship, Gilmer TX,
  founder Rashad Durrand Smith, rocdaddy850@gmail.com), `/contact` (form), `/privacy`,
  `/disclosure` (ads + affiliate disclosure), `/sitemap.xml` (12 articles),
  `/robots.txt`, `/rss.xml` (12 items).
- **Full-stack (Phase 1):** `POST /api/newsletter` and `POST /api/contact` validate input
  and store it locally in `data/submissions.json`. No external service, no email is sent.
- **Gumroad cross-link:** only one verified product is linked, where relevant — the
  Course & Notion Stack ($79), https://rocdaddy.gumroad.com/l/btwoa — on the home page
  and in 2 articles (time-saving tools, content planning). No other product links exist.
- **AdSense:** placeholder component only (`components/AdSlot.js`), gated by
  `NEXT_PUBLIC_ADSENSE_CLIENT`. With the variable unset (the default), pages render a
  labelled box — “Ad space — ads load only after AdSense approval” — and load **no**
  AdSense script and **no** publisher ID. No publisher ID was invented.

## How to run

```bash
cd ~/workspace/ai-tools-hub
npm install
npm run build     # production build
npm start         # production server on http://localhost:3000
npm test          # verification suite (boots the production server on port 3100)
npm run dev       # development server
```

Optional environment (only after AdSense approval, see below):

```bash
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX   # real publisher ID, from Google
NEXT_PUBLIC_SITE_URL=https://your-real-domain.com    # replaces the example.com placeholder
```

## PROVEN (verified locally, 2026-11-12)

- `npm run build` passes: 26 static pages, all 12 article slugs prerendered.
- `npm test`: **86 passed, 0 failed** — article data (12 articles, unique slugs, word
  counts 800–1200, valid related links), production server responses (home + all 12
  article pages + about/contact/privacy/disclosure all 200), sitemap lists 12 articles,
  RSS lists 12 items, no AdSense script present when the client ID is unset, newsletter
  and contact POSTs return 200 and are stored in `data/submissions.json`, invalid email
  rejected with 400.
- `curl` against the production server: home and 2 article pages return 200 with the
  expected content (see test output; test data in `data/submissions.json` was cleared
  after verification).

## NOT proven / NOT done (do not claim otherwise)

- No live domain, no deploy to Vercel or anywhere else.
- No Google AdSense account, no application submitted, no approval, no ads running.
- No traffic, no search indexing, no earnings — AdSense revenue is traffic-dependent
  and not guaranteed. AdSense is advertising revenue, not subscription/recurring revenue.
- No email sending: newsletter/contact submissions are stored locally only.
- On Vercel hosting the form write fails soft (read-only filesystem): the
  form still returns success but the submission is NOT persisted — the
  response carries `stored: false`. A real store (e.g. Supabase) is a
  Phase 2 decision, not a silent loss.
- No analytics or tracking scripts in Phase 1.
- `NEXT_PUBLIC_SITE_URL` defaults to `https://example.com` — a placeholder that must be
  replaced with the real domain before any AdSense application.

## AdSense application checklist (future, Rashad-side)

1. Buy a domain and deploy this site to it (Vercel free tier works for this stack).
2. Set `NEXT_PUBLIC_SITE_URL` to the real domain and redeploy.
3. Confirm the site is indexed by Google (Search Console) and the policy pages
   (Privacy, Disclosure, About, Contact) are live.
4. Publish more original content over time and build real traffic — approval needs a
   site with substantial content and visitors, not just the 12 launch articles.
5. Create a Google AdSense account, submit the live domain, and wait for review.
   Do not place ad code until approved.
6. Only then set `NEXT_PUBLIC_ADSENSE_CLIENT` to the real publisher ID from Google and
   redeploy. The placeholder boxes will be replaced by real ad units automatically.
