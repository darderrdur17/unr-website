# UNR Website Redesign — Working Prototype

This is a functional HTML/CSS/JS prototype of the redesigned unr.ac.id, built directly
from the companion documents:

- `UNR Positioning, Website & AI-Perception Audit` (Sep 2026)
- `UNR Website Redesign — Technical Specification` (v1.0, Sep 2026)
- `UNR Competitive Social Media Audit & Gen Z Content Strategy` (Apr 2026)

## How to view it

No build step, no server required. Just open in a browser:

1. Unzip this package.
2. Double-click `index.html` (or `pmb.html` / `tentang.html`) to open it
   directly in Chrome, Safari, or Edge.
3. To see it the way a visitor would — with all fonts and interactions working —
   an internet connection is needed once, since headings/body text load from
   Google Fonts via CDN.

For the most accurate preview (some browsers restrict local file scripts),
you can also serve it locally:

```
cd site
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

This prototype now uses **public facts from [unr.ac.id](https://unr.ac.id)** and **[pmb.unr.ac.id](https://pmb.unr.ac.id)** — history (23 May 1979), nine programs, rector 2026–2030, accreditation Baik Sekali, campus address, and official PMB steps. Motion includes scroll reveals, program filters, a testimonial slider, and a proper mobile drawer. `prefers-reduced-motion` is still respected.

## What's included

| File | Purpose |
|---|---|
| `index.html` | Homepage |
| `fakultas.html` | Faculties & graduate school |
| `berita.html` | Official campus news |
| `pmb.html` | PMB home prototype based on pmb.unr.ac.id/home |
| `kontak.html` | Dedicated Contact Us page (channels, form, campus photo, map) |
| `tentang.html` | About / Visi & Misi, with the Tri Hita Karana explainer |
| `assets/i18n.js` | Indonesian + English copy; switcher persists in localStorage |
| `assets/img/` | Official photos downloaded from unr.ac.id (`files/image/…`) |
| `assets/style.css` | Full design system — colors, type, components |
| `assets/script.js` | Language switch, lightbox, news/program filters, motion, nav |

## Design system at a glance

- **Colors:** Navy `#0D1F35` (primary), Gold `#C8960C` (accent/CTA), Jade `#3F6B52`
  (secondary accent, tied to Tri Hita Karana's nature pillar), warm Cream `#FBF8F2`
  background.
- **Type:** Fraunces (serif, headings — chosen for its editorial, heritage feel that
  fits the Ngurah Rai historical narrative) + Plus Jakarta Sans (body/UI).
- **Motion:** deliberately restrained. One orchestrated entrance on the homepage hero
  (headline words rising in), functional animation only elsewhere (stat counters,
  countdown timer, tabs, accordion, stepper) — no decorative fade-ins scattered across
  every section. `prefers-reduced-motion` is respected throughout.

## What's real vs. placeholder

Everything structural (layout, copy direction, positioning statement, information
architecture) is meant to be used as-is or lightly edited. The following are
explicitly marked placeholders that need real content before this goes live:

- All photos/videos (shown as labeled navy/gold placeholder frames)
- Fee table numbers (Section 5.1 of the Technical Specification has the intended
  data structure)
- History timeline years/milestones
- Leadership names and accreditation status/year
- Student and alumni testimonial quotes
- Phone number, WhatsApp number, and email address
- The countdown target date (currently set to 31 Jan 2027 as a placeholder)

## Known limitations of this prototype

- This is static HTML — the CMS content model described in the Technical
  Specification (Section 10) would need to be implemented separately for a
  production build.
- The document checklist and stepper are illustrative interactions only; nothing is
  saved or submitted anywhere.
- The WhatsApp button and contact links use placeholder numbers — replace
  `6282100000000` throughout before sharing publicly.
- Instagram/TikTok feed embeds are shown as static placeholder tiles, not live embeds.

## Suggested next step

Use this prototype in a review session with the WR 3 team to sign off on the
positioning line, layout order, and content requirements — then hand the approved
version to whoever builds the production CMS-backed site, using the Technical
Specification document as the implementation brief.
