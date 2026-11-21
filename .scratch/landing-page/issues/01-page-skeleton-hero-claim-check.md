# 01 — Page skeleton, hero, email CTA, claim check

Spec: `.scratch/landing-page/spec.md`. Glossary: `CONTEXT.md`. Product facts (read-only): sibling `mediprompt` checkout.

**What to build:** A visitor opens the built site and sees one Bahasa Indonesia page: the MediPrompt logo, teal brand colours, a hero that positions MediPrompt as nurse-call and clinical communication that works alongside the hospital's SIMRS, a primary pilot demo request button (email), and a footer crediting Risentera as Publisher and PLAI BMD as Partner. The build fails whenever the output contains a price or a banned claim, or lacks the required items. This is the tracer bullet: every later ticket adds sections and its own required items to the same check.

**Blocked by:** None — can start immediately

**Status:** done (uncommitted)

- [x] Astro static project; `astro build` exits 0 and emits plain static files; no UI framework integration, no Tailwind/MUI, no third-party runtime requests (fonts, analytics, CDNs)
  - Evidence: `npm run check` → `[build] 1 page(s) built … Complete!`, exit 0; dist = index.html, _astro/*.css, 2 PNGs; 0 `<script>` tags; only deps `astro@^7.4.13` (no @astrojs framework/tailwind pkgs); only src/href in dist are local paths, `#alur`, mailto, https://plai.ac.id/.
- [x] MediPrompt logo and brand colour `#0F766E` copied from the sibling client; the Sintesa logo is not used
  - Evidence: `public/mediprompt-logo.png` and `public/favicon.png` (= client `public/icons/icon-192.png`) copied; `--c-teal: #0f766e` + `theme-color #0F766E`. Client `src/app/icon.svg` is the Sintesa mark (identical paths to `sintesa-logo.svg`) so not used; `grep -ri sintesa src public dist` → 0.
- [x] `<html lang="id">`, `<title>`, meta description, `og:title`, `og:description`; no canonical/`og:url` (no domain yet — leave one config value for it)
  - Evidence: dist/index.html has `<html lang="id">`, `<title>`, meta description, og:title, og:description; no `canonical`/`og:url` (grep empty). `astro.config.mjs` `site: undefined` is the one domain value; Base.astro emits canonical/og:url only when it is set.
- [x] Hero: headline + subcopy (works alongside SIMRS, never 'terintegrasi'), primary button `mailto:info.risentera@gmail.com` with subject 'Permintaan demo MediPrompt', secondary link scrolling to the flow section anchor
  - Evidence: Hero.astro h1 + lead ("bekerja berdampingan dengan SIMRS … bukan menggantikannya"), primary `mailto:info.risentera@gmail.com?subject=Permintaan%20demo%20MediPrompt`, secondary `href="#alur"`; claim-check SIMRS-integration rule passes.
- [x] Footer: '© Risentera', 'Mitra: Politeknik Artificial Intelligence Budi Mulia Dua (PLAI BMD)' linking to https://plai.ac.id/ (text only, no PLAI logo), contact email
  - Evidence: Footer.astro: `© Risentera…`, `Mitra: <a href="https://plai.ac.id/">Politeknik Artificial Intelligence Budi Mulia Dua (PLAI BMD)</a>` (text only), `mailto:info.risentera@gmail.com`; required rules `PLAI BMD credit`/`PLAI BMD link` pass.
- [x] Claim-check script (Node stdlib only) runs after build via the package build/check script; scans built HTML; fails on banned terms from the spec's claim policy (price/'Rp', SIMRS integration claim, 'rekam medis otomatis'/'draf rekam medis', accuracy %, 'tersertifikasi'/'ISO'/'Kemenkes'/'HIPAA'/'SATUSEHAT' claims, AI 'diagnosis', uptime/SLA numbers); prints file + matched term
  - Evidence: `scripts/check-claims.mjs` (stdlib only), `npm run check` = `astro build && node scripts/check-claims.mjs`; 11 BANNED rules on visible text + alt/title/content/aria-label/href/src. Probe injecting into dist HTML: alt `Akurasi 98%` → `percentage … → 98%`; meta content `Tersertifikasi ISO 27001` → `certification/compliance claim → Tersertifikasi`; title `Terintegrasi dengan SIMRS` → `SIMRS integration claim`; `diagnosis` → caught; wa.me → caught; external `<script src>` → caught.
- [x] Required-content rules in the same script for this ticket's items: lang=id, mailto link, PLAI BMD credit, title, og:title, og:description; the rule list is one obvious place later tickets append to
  - Evidence: `REQUIRED` array (8 entries: lang=id, title, meta description, og:title, og:description, mailto, PLAI credit, PLAI link) at top of script; probe with `lang="en"` → `missing: html lang="id" → …`.
- [x] Evidence that the check fails once: temporarily add 'Rp' to the page, show the failing output, revert
  - Evidence: added `Rp 4.500.000` to Hero lead → `npm run check` → `index.html: price / Rp → Rp 4.500.000`, EXIT=1; removed exact text, `grep -rn "Rp\|4.500" src/` → no match; rerun → `check-claims: OK — 1 HTML file(s), 11 banned + 8 required rules`, EXIT=0.
- [x] No WhatsApp link, no pricing, no analytics/cookies
  - Evidence: `grep -rniE 'whatsapp|wa\.me|cookie|analytics|gtag' src public dist` → no match (exit 1); banned rules for Rp/WhatsApp/analytics/third-party resources pass.
