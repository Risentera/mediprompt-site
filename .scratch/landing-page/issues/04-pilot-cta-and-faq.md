# 04 — Pilot CTA + FAQ

Spec: `.scratch/landing-page/spec.md`. Glossary: `CONTEXT.md`. Product facts (read-only): sibling `mediprompt` checkout.

**What to build:** A hospital director reaching the end of the page finds a clear pilot demo request and answers to the obvious objections without emailing.

**Blocked by:** 01 — Page skeleton, hero, email CTA, claim check

**Status:** done (uncommitted)

- [x] Pilot CTA section with the same mailto link and subject as the hero, plus the line 'Hubungi kami untuk penawaran.'; no prices, no WhatsApp link
  - Evidence: `grep -o 'href="mailto[^"]*"' dist/index.html` → 4× `mailto:info.risentera@gmail.com?subject=Permintaan%20demo%20MediPrompt` (hero, header, CTA button, CTA email); `PilotCta.astro` contains 'Hubungi kami untuk penawaran.'; check-claims banned `WhatsApp link` + `price / Rp` pass (exit 0).
- [x] FAQ using native <details>/<summary>, no JavaScript, six items: replaces SIMRS? (no, works alongside); is the AI a diagnosis? (no, advisory, the nurse decides); what hardware is needed? (bedside devices, in pilot); where is data stored? (dedicated installation per hospital); what does it cost? (ask for a quotation); is it integrated with SIMRS? (not claimed — discussed during the pilot)
  - Evidence: `grep -o '<details' dist/index.html | wc -l` → 6; `grep -c '<script' dist/index.html` → 0; summaries: menggantikan SIMRS / saran AI vs penilaian perawat / perangkat di kamar / data disimpan / biaya / terhubung langsung ke SIMRS (worded to pass banned diagnos(is|a) + integrasi SIMRS rules).
- [x] Claim check: adds a required rule for 'Hubungi kami untuk penawaran'; build + check pass
  - Evidence: red — quotation line changed temporarily → `index.html: missing: quotation line → (no match for /Hubungi kami untuk penawaran/)`, exit 1; green after restore → `check-claims: OK — 1 HTML file(s), 11 banned + 11 required rules`, exit 0 (`flock …/build.lock npm run check`).
