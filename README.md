# RMS Chartered Accountants Inc. — Website

A static one-page site for RMS Chartered Accountants Inc. Plain HTML/CSS/JS — no build step,
no framework, no dependencies. Same approach as the HVNS site: fast, hostable anywhere, and
nothing to patch or keep up to date.

## File overview

```
index.html          Page content (single page, anchor-linked sections)
css/styles.css      Design tokens + layout (light/dark theme via CSS variables)
js/main.js          Theme toggle, mobile nav, scroll-reveal, back-to-top, contact form
assets/favicon.svg  Placeholder mark (petrol square, serif "R")
_headers            Cloudflare Pages security headers (CSP, HSTS, etc.)
robots.txt          Currently blocks ALL indexing — see "Going live" below
sitemap.xml         Ready for when the site is public
.assetsignore       Keeps README.md out of the Pages upload
```

## Previewing locally

Any static file server works:

```bash
python -m http.server 8080
# then open http://localhost:8080
```

Opening `index.html` directly via `file://` mostly works too, but use a server if you want
the Google Maps embed and `localStorage` theme persistence to behave normally.

## Design notes — how this differs from the HVNS site

The scaffolding is shared, the design language is not. Deliberate differences:

| | HVNS | RMS |
|---|---|---|
| Palette | Navy `#1A2B3C` + gold `#F5A623` | Petrol-teal `#0E3B3C` + teal `#1F7A6B` |
| Background | White / grey | Warm paper `#FBF9F6` |
| Headings | Trebuchet MS (sans) | Georgia (serif) |
| Cards | Solid dark navy panels | Light cards, warm hairline borders, teal left rule |
| Services | 3-column icon-card grid | Numbered ledger (01–06) with tag pills |
| Accent device | Gold rule inline before eyebrow | Teal rule above eyebrow |
| Header | Logo + nav + portal/Calendly CTAs | Utility bar (accreditations + contact) above nav row |
| Sections unique to it | Partners/tech, Calendly | Public-sector band, values ledger, timeline, contact form |

No webfonts anywhere — everything is a system font stack, so there are no external requests
and the strict CSP stays intact.

## Content sources

Company description, mission, values, service list, history, team, contact details and
accreditations were all taken from the live site at rmsauditors.co.za so the copy is factually
accurate. Two things were **not** carried over verbatim:

- The live site says Rozel Scheepers has *"12 years' experience in public practise"*. That was
  written around 2012 and is now stale, so the copy says "qualified as a Chartered Accountant
  in 2000" and "more than two decades" instead — accurate regardless of when it is read.
- Karien de Villiers' role and qualifications are not stated on the live site, so nothing was
  invented. See the TODO below.

## Content still to fill in

- **Logo** — the header and footer use a text wordmark (`.brand`), and `assets/favicon.svg` is a
  placeholder serif "R". Swap both for the real brand mark when supplied.
- **Karien de Villiers** (`index.html`, `id="team"`) — job title, qualification and bio need
  confirming with the firm. There is a `TODO` comment on the card.
- **Team photos** — both cards use a serif initials monogram (`.team-monogram`). Replace with an
  `<img>` once photographs are available.
- **Office hours** (`index.html`, Contact section) — currently Mon–Fri 08:00–16:30 as a sensible
  default. The live site does not state them, so confirm before going live. Marked with a `TODO`.
- **Accreditation logos** (`id="accreditations"`) — currently text abbreviations. SAICA, IRBA and
  SAIPA each have their own member-logo usage rules; check those before publishing the marks.
- **Social links** — the live site has Facebook, Twitter/X and LinkedIn presence, but the URLs
  aren't exposed. Get them and add a social row to the footer if wanted.
- **News / newsletters** — the live site has a News section with newsletters. Not built here;
  say the word if it's wanted (a simple list of linked PDFs is the low-maintenance option).

## The contact form

There is **no server behind it**. `js/main.js` validates the required fields, then composes a
`mailto:` link to `admin@rmsauditors.co.za` with everything pre-filled. That keeps the deploy
purely static.

To take submissions properly later, pick one:

1. **Cloudflare Pages Function** — add `functions/api/contact.js`, `fetch()`-POST to it from
   `main.js`, and widen `connect-src` in `_headers`. Stays entirely on Cloudflare.
2. **Hosted form service** (Formspree, Web3Forms, etc.) — point the `<form>` at their endpoint
   and widen `form-action` in `_headers`.

The handler in `js/main.js` has a comment block marking exactly where to make the swap.

## Deploying to Cloudflare Pages

No domain is needed to deploy — you get a free `*.pages.dev` URL to work from, and can attach
a custom domain later without redeploying.

### Option A — Dashboard drag-and-drop (fastest)

1. Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** →
   **Upload assets**.
2. Name it (e.g. `rms-website`) and upload this whole folder.
3. No build command and no output directory override — it's already static at the root.
4. You'll get a `rms-website.pages.dev` URL to review on.

### Option B — Wrangler CLI (repeatable)

```bash
npx wrangler login
npx wrangler pages project create rms-website
npx wrangler pages deploy . --project-name=rms-website
```

### Option C — Connect a GitHub repo (best if you'll keep iterating)

Push this folder to a repo, then in Cloudflare Pages choose **Connect to Git**. Every push to
`main` auto-deploys.

### Attaching the domain once you have one

Project → **Custom domains** → **Add a custom domain**. Cloudflare creates the DNS record and
provisions SSL automatically, usually within a few minutes.

## Going live

Three things are locked down for the test phase and must be reverted:

1. `robots.txt` — currently `Disallow: /`. Change to `Allow: /` and uncomment the `Sitemap:` line.
2. `index.html` — remove the `<meta name="robots" content="noindex, nofollow">` tag (there's a
   comment right above it).
3. Add a `<link rel="canonical">` tag and update `og:url` in `index.html`, plus `<loc>` in
   `sitemap.xml`, to the final domain. All three currently assume `www.rmsauditors.co.za`.

## Security notes

- `_headers` sets a strict CSP (`default-src 'self'`), HSTS, `X-Frame-Options: DENY` and a
  locked-down `Permissions-Policy`. There is no inline `<script>` or `<style>` anywhere, so the
  CSP does not need `unsafe-inline`.
- The only third-party embed is the Google Maps iframe in the Contact section, allowed via
  `frame-src https://www.google.com`. Remove that directive if you drop the map.
- Adding analytics, a form backend, or any embed later means widening the CSP in `_headers`
  to match — that file is the single place to change.
