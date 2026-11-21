# 02 — Problem + request flow with queue mock

Spec: `.scratch/landing-page/spec.md`. Glossary: `CONTEXT.md`. Product facts (read-only): sibling `mediprompt` checkout.

**What to build:** A head nurse reading the page recognises the problem (patient calls that are missed, unclear, or owned by nobody) and follows how a button press becomes a voice assistance request handled in the monitoring center, beside a mock of the queue.

**Blocked by:** 01 — Page skeleton, hero, email CTA, claim check

**Status:** done (uncommitted)

- [x] Problem section with no statistics or sourced-looking numbers
  - Evidence: src/components/Problem.astro — three cards (Terlewat / Tidak jelas / Tanpa penanggung jawab), no numbers; `npm run check` → `check-claims: OK` (no `%` match).
- [x] Flow section (anchor targeted by the hero's secondary link) with steps grounded in the calls v2 design: button press → request saved and shown in the monitoring center at once, even with no speech → optional spoken message → advisory urgency suggestion → one nurse claims it (assistance claim) → nurse may record nurse-assessed urgency, which takes precedence → nurse resolves
  - Evidence: src/components/Flow.astro `<section id="alur">`, six ordered steps press→saved+shown even without speech→optional voice→saran urgensi→one nurse claims→nurse urgency takes precedence→owner resolves; `grep -o 'id="alur"' dist/index.html` → `id="alur"`.
- [x] Mentions unclaimed assistance escalation to head nurses without promising a specific number of seconds; mentions requests are visible only to room-assigned nurses and authorised head nurses
  - Evidence: Flow.astro notes: "dinaikkan ke kepala perawat" after "batas waktu tertentu" (no seconds); "hanya terlihat oleh perawat yang ditugaskan di kamar tersebut dan kepala perawat yang berwenang".
- [x] AI urgency is always labelled as a suggestion ('saran', advisory) and never 'diagnosis'/'triase klinis'
  - Evidence: copy uses "Saran urgensi dari AI … Ini hanya saran; perawat yang memutuskan", mock source "Saran AI"; `grep -oiE 'diagnos|triase' dist/index.html` → no output; banned rule passes.
- [x] Inline SVG/CSS monitoring-center queue mock with fictional, non-identifying sample data (e.g. 'Kamar 204'), real-looking statistics absent; has a text alternative
  - Evidence: CSS-only queue mock in Flow.astro (Kamar 204/112/309, Perawat A, no statistics), `role="img"` + descriptive `aria-label`, figcaption marks data as fictional.
- [x] Claim check: adds a required rule for the advisory label; build + check pass
  - Evidence: REQUIRED `{ label: 'advisory urgency label', pattern: /saran urgensi/i }`; red (phrase removed) → `index.html: missing: advisory urgency label` exit 1; restored → `check-claims: OK — 1 HTML file(s), 11 banned + 11 required rules` exit 0.
