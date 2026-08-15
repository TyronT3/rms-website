# RMS Chartered Accountants Inc. — Website

A static one-page site for RMS Chartered Accountants Inc. The deployed site remains plain
HTML/CSS/JS with no framework or runtime dependencies. A small Node-based development harness
provides local preview, source validation, static integrity checks and a production build.

## File overview

```
index.html          Page content (single page, anchor-linked sections)
css/styles.css      Design tokens + layout (light/dark theme via CSS variables)
js/main.js          Theme toggle, mobile nav, scroll-reveal, count-up stats,
                    scroll progress, scrollspy, back-to-top, contact form
assets/favicon.svg  Placeholder mark (petrol square, serif "R")
scripts/verify-static.mjs
                    Checks IDs, anchor targets, local files and subpath-safe URLs
package.json        Local preview, validation and production build commands
vite.config.mjs     Relative-path production build; copies deployment metadata
eslint.config.mjs   Browser JavaScript correctness checks
stylelint.config.mjs
                    CSS correctness checks fitted to the existing stylesheet
.htmlvalidate.json  HTML structure and accessibility-oriented validation
.editorconfig       Shared whitespace and line-ending conventions
_headers            Cloudflare Pages security headers (CSP, HSTS, etc.)
robots.txt          Currently blocks ALL indexing — see "Going live" below
sitemap.xml         Ready for when the site is public
.assetsignore       Keeps README.md out of the Pages upload
```

## Development workflow

Install the development dependencies once, then start the local preview:

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run dev          # Vite preview with automatic reload
npm run check        # HTML, CSS, JS, link/asset checks, then production build
npm run build        # writes a deployable site to dist/
npm run preview      # serves the generated dist/ build locally
```

Run `npm run check` before every push. Opening `index.html` directly via `file://` still mostly
works, but a server is required for an accurate preview of the Google Maps embed, module script
and `localStorage` behaviour.

## Design notes — how this differs from the HVNS site

The scaffolding is shared, the design language is not. Deliberate differences:

| | HVNS | RMS |
|---|---|---|
| Palette | Navy `#1A2B3C` + gold `#F5A623` | RMS blue `#1C4F78` + accent `#1A6394` |
| Background | White / grey | Cool paper `#F7F9FB` |
| Headings | Trebuchet MS (sans) | Georgia (serif) |
| Cards | Solid dark navy panels | Indexed working-paper panels with hairline rules |
| Services | 3-column icon-card grid | Numbered service records with scope checklists |
| Accent device | Gold rule inline before eyebrow | Blue rule above eyebrow, drawn on reveal |
| Header | Logo + nav + portal/Calendly CTAs | Utility bar (accreditations + contact) above nav row |
| Sections unique to it | Partners/tech, Calendly | Public-sector band, principles, timeline, marquee, contact form |

No webfonts anywhere — everything is a system font stack, so there are no external requests
and the strict CSP stays intact.

### Liveliness without extra colour

The brief was a livelier, more active feel — the palette above unchanged. Everything that
does that work is motion, shape or rhythm, never a new hue:

- **Audit-dossier structure.** The hero engagement brief, proof cells, service references,
  review ticks and registration indexes borrow from working papers without becoming literal
  stationery. Corners are tighter on content panels; pills are reserved for controls.
- **Aurora orbs** (`.orbs` / `.orb`) — blurred radial washes of the same brand blue, drifting
  on 19–27s loops behind the hero and both dark slabs. Hidden below 640px.
- **Active review details.** The hero underline draws in, the engagement file receives a slow
  scan of blue light, the senior-review mark drifts, and the registration tick breathes. These
  stay deliberately slower and smaller than the scroll-reveal motion.
- **Count-up practice depth.** The `25+` figure already contains its final value in the markup,
  so it is correct with JS off — the script only animates the approach.
- **A credential marquee.** The item list appears **twice** and the track travels exactly
  `-50%`; that is what makes the loop seamless, so keep the two copies identical if you edit
  it. Pauses on hover.
- **Scroll-progress rule** across the top of the header, and **scrollspy** on the primary nav.
- **Directional staggered reveals** — `.reveal` plus `.reveal-left` / `.reveal-right` /
  `.reveal-scale`, with stagger from `.stagger > .reveal:nth-child()`. The stagger lives in
  CSS rather than inline styles because the CSP disallows those.

Every animation is disabled under `prefers-reduced-motion: reduce`. Each keyframe is authored
to **start and end on its resting frame**, so a frozen animation still renders the intended
composition — worth preserving if you add more.

### Brand colour

`#1C4F78` is taken from the firm's live site, where it sets every heading, every link, the
header background and the footer bar. The two supporting accents (`#1A6394` for light
surfaces, `#5AA7DD` for dark bands) were chosen to hit WCAG AA against the surfaces they sit
on — 6.1:1 and 5.5:1 respectively. If you change the blue, re-check those two.

The Divi default blue `#2EA3F2` also appears all over their current site's CSS, but that is
the theme's stock accent rather than a brand colour, so it was not used.

## Content sources

Company description, mission, values, service list, history, contact details and accreditations
were all taken from the live site at rmsauditors.co.za so the copy is factually accurate.
Departures from that source:

- The live site says Rozel Scheepers has *"12 years' experience in public practise"*. That was
  written around 2012 and is now stale, so the copy says "qualified as a Chartered Accountant
  in 2000" and "more than two decades" instead — accurate regardless of when it is read.
- **Karien de Villiers has been removed entirely** (she is no longer with the firm) — her team
  card and the 2012 timeline entry are both gone, per Tyron. The live site still lists her.
- Staff names and roles (Jolene Rheeder, Ansonette Truter, Marizaan van der Lingen, Anzelle
  van der Vyver, Sandra Swanepoel, Josephine, Vene Putter and Suzanne Scheepers) and the office
  hours were supplied directly by Tyron, not sourced from the live site.
- The hero stat strip reads **"25+ years in practice"**. Founded in 2000, so the `+` keeps it
  true indefinitely — but it is deliberately conservative and worth rounding up at the next
  milestone. It is hardcoded in two places that must match: the `data-count` attribute and the
  element's text content (the text is what shows with JS disabled).

## Content still to fill in

- **Logo** — the header and footer use a text wordmark (`.brand`), and `assets/favicon.svg` is a
  placeholder serif "R". Swap both for the real brand mark when supplied.
- **Josephine's surname** (`index.html`, `id="team"`) — her Admin & Support role is included,
  but her surname still needs to be confirmed.
- **Team photos** — all cards use a serif initials monogram (`.team-monogram` / `.staff-monogram`).
  Replace with an `<img>` once photographs are available.
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

## Temporary preview: GitHub Pages

Live at **https://tyront3.github.io/rms-website/** — a stopgap for showing the site to someone
before Cloudflare is set up. Every push to `main` rebuilds it automatically (usually under a
minute).

```bash
git add -A && git commit -m "your message" && git push
```

Notes:

- The repo is **public**, because GitHub Pages only serves from public repos on a free account.
  The `noindex` meta tag and `robots.txt` `Disallow: /` are both still in place, so search
  engines skip it — but the URL and source are technically viewable by anyone who has the link.
- `_headers` does nothing here — it is a Cloudflare Pages feature. The security headers only
  take effect once the site is on Cloudflare. `.nojekyll` stops GitHub from running the files
  through Jekyll.
- All asset paths are relative, so the site works correctly from the `/rms-website/` subpath
  without any config.
- To take the preview down: `gh api -X DELETE repos/TyronT3/rms-website/pages`, or delete the
  repo with `gh repo delete TyronT3/rms-website`.

## Deploying to Cloudflare Pages

No domain is needed to deploy — you get a free `*.pages.dev` URL to work from, and can attach
a custom domain later without redeploying.

### Option A — Dashboard drag-and-drop (fastest)

1. Run `npm install && npm run check`.
2. Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** →
   **Upload assets**.
3. Name it (e.g. `rms-website`) and upload the generated `dist/` folder.
4. You'll get a `rms-website.pages.dev` URL to review on.

### Option B — Wrangler CLI (repeatable)

```bash
npx wrangler login
npx wrangler pages project create rms-website
npm run build
npx wrangler pages deploy dist --project-name=rms-website
```

### Option C — Connect a GitHub repo (best if you'll keep iterating)

Push this folder to a repo, then in Cloudflare Pages choose **Connect to Git**. Set the build
command to `npm run build` and the output directory to `dist`. Every push to `main` then
auto-deploys.

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
