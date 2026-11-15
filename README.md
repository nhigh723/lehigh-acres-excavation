# Lehigh Acres Excavation Guide — Rank-and-Rent Site (Batch 3)

Static HTML/CSS site. No build step, no frameworks, no backend.
Brand: **Lehigh Acres Excavation Guide** — an honest local-resource
guide, NOT a fake contractor. See the honesty rules in the task brief:
no fake reviews, address, phone, license claims, or company names; no
HLW affiliation; all content original; prices are typical ranges from
published cost guides (Angi, HomeGuide, Florida contractor guides)
with "varies by lot and job" caveats. No price was invented — every
figure was verified via web search before use.

## Files

| File | Purpose |
|---|---|
| `index.html` | Home — hero, services, Lehigh Acres specifics, cost snapshot, FAQ teaser, quote CTA |
| `site-excavation.html` | Service page + Service schema |
| `foundation-digging.html` | Service page + Service schema |
| `drainage-grading.html` | Service page + Service schema |
| `trenching-utilities.html` | Service page + Service schema |
| `demolition-removal.html` | Service page + Service schema |
| `cost-guide.html` | Detailed pricing + FAQPage schema (3 pricing Q&As) |
| `faq.html` | 14 Q&As + FAQPage schema |
| `get-a-quote.html` | Quote form (name, phone, email, area, service, project size, description) |
| `css/style.css` | Single stylesheet, mobile-first (copied from the Lehigh land-clearing template) |
| `js/main.js` | Mobile nav, dropdown, form logic |
| `sitemap.xml` | All 9 pages |
| `robots.txt` | Allow all + sitemap reference |
| `.nojekyll` | GitHub Pages: skip Jekyll processing |

## Form adaptation

The template's "acreage" field became **Project size** (Small — trench /
single footing / small pad; Medium — foundation / driveway / drainage
run; Large — full site / deep dig / multi-part job; Not sure). `js/main.js`
was updated to match (validation, summary, error text all reference
project size, not acreage). No leftover "acreage" references.

## Before publishing

1. **Replace the placeholder domain.** `nhigh723.github.io/lehigh-acres-excavation`
   appears in canonical tags, schema URLs, `sitemap.xml`, and
   `robots.txt`. It is NOT a registered domain — it is a placeholder.
   Find-and-replace it with the live domain (or the GitHub Pages URL)
   on publish. Every occurrence is marked with a
   `PLACEHOLDER DOMAIN` comment.
2. **Quote form endpoint.** `js/main.js` has two config consts at the
   top of the form section: `FORM_ENDPOINT` (a form-service URL that
   accepts a JSON POST, e.g. Formspree) and `FORM_MAILTO` (fallback
   inbox). Both are empty today. Until they are set, submitting the
   form opens the visitor's email app with the request pre-filled and
   shows the details on the page with a copy button — honest, and
   nothing is silently lost. No email address or phone number is
   hardcoded anywhere on the site.

## SEO / GEO notes

- Unique title + meta description per page; one H1 per page; clean
  H2/H3 structure; direct-answer intros (first 50–70 words answer the
  page's question).
- FAQPage schema on homepage (4 Q&As), FAQ page (14 Q&As), and
  cost guide (3 pricing Q&As). Service schema on all 5 service pages.
  WebSite schema on the homepage.
- Internal linking between all pages (nav, service cards, in-content
  links, footer).
- Fast: system fonts, no frameworks, one CSS file, one small JS file,
  no images.

## Originality

Sentence-level audit vs both the land-clearing template and the
Lehigh tree-removal site (prose-only, town names normalized out,
FAQ questions and form labels excluded): at most 10% identical
sentences vs each. Price facts, CTA formulas, and disclaimer wording
may match; all body prose was written fresh for excavation.

## Local verification

Run `python3 -m http.server 8000` from this directory and open
http://localhost:8000/ — all 9 pages plus CSS, JS, sitemap, and
robots should return 200. Run `node --check js/main.js` for syntax.
