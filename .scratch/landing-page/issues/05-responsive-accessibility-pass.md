# 05 — Responsive + accessibility pass

Spec: `.scratch/landing-page/spec.md`. Glossary: `CONTEXT.md`. Product facts (read-only): sibling `mediprompt` checkout.

**What to build:** The finished page reads well on a phone and a desktop and works with keyboard and screen reader.

**Blocked by:** 02 — Problem + request flow; 03 — Visit Doctor, bedside devices, deployment; 04 — Pilot CTA + FAQ

**Status:** done (uncommitted)

- [x] Built page served locally and checked in a browser at 375 px and 1280 px widths: no horizontal scroll, sections readable
  - Evidence: `npx astro preview --port 4325` + CDP `Emulation.setDeviceMetricsOverride` → 375: scrollWidth 375 / innerWidth 375; 1280: scrollWidth 1265 / clientWidth 1265 (innerWidth 1280 incl. scrollbar); 0 elements past the viewport edge at either width; full-page screenshots inspected, no overlap/clipping.
- [x] One h1, ordered headings; all images/SVG mocks have alt text or a text alternative; link text is meaningful
  - Evidence: `querySelectorAll('h1').length` = 1 at both widths, order h1 → h2 → h3 with no skipped level; media: logo `img alt="MediPrompt"`, queue mock `role="img"` with full `aria-label` (inner markup `aria-hidden`); no `svg`; 8 links, all with descriptive text. Fix: header split into `Header.astro` so the hero/h1 sits inside `<main>` (body children now HEADER, MAIN, FOOTER).
- [x] Keyboard: every link and FAQ toggle reachable, visible focus ring; colour contrast of teal on white text meets WCAG AA for body text
  - Evidence: Tab via CDP `Input.dispatchKeyEvent` reached 14/14 focusables (8 links + 6 summaries) at both widths, each `:focus-visible` with `outline: 3px solid rgb(15,118,110)`; Enter opened and Space closed each of the 6 `<details>`. Contrast: teal/white 5.47, white/teal 5.47, teal/#f6f8fa 5.14, slate/white 7.58, navy/white 14.05; 0 text nodes below AA.
- [x] Screenshots at both widths saved as evidence and referenced in the completion note
  - Evidence: `.scratch/landing-page/evidence/05-375.png` (375×7851), `.scratch/landing-page/evidence/05-1280.png` (1280×~5567), taken after the final build.
- [x] Final `astro build` + claim check pass
  - Evidence: `npm run check` → EXIT=0, `check-claims: OK — 1 HTML file(s), 11 banned + 11 required rules`.
