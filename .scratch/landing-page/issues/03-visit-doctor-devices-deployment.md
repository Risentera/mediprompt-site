# 03 — Visit Doctor, bedside devices, deployment

Spec: `.scratch/landing-page/spec.md`. Glossary: `CONTEXT.md`. Product facts (read-only): sibling `mediprompt` checkout.

**What to build:** A doctor, procurement officer and IT head can read what Visit Doctor transcription does, which bedside devices a room uses (clearly in pilot), and how MediPrompt is installed per hospital.

**Blocked by:** 01 — Page skeleton, hero, email CTA, claim check

**Status:** done (uncommitted)

- [x] Visit Doctor section: a session records the doctor–patient conversation and a transcript ('transkrip') is attached; can be started by staff or by the room's microphone; no 'rekam medis', 'ringkasan', 'draf', or accuracy claim; optional SVG mock with fictional data
  - Evidence: `src/components/VisitDoctor.astro` rendered in dist/index.html; `grep -c transkrip` → 3; `grep -niE 'rekam medis|ringkasan|draf|akura'` on component → no match (exit 1); SVG mock skipped (optional).
- [x] Bedside devices section labelled 'Dalam tahap pilot': three separate devices — call button, microphone, teleprompter screen — connected to the nurse dashboard; the teleprompter screen shows only 'request sent' and 'Visit Doctor recording in progress'; no staff free-text prompts, no specs, no photo or placeholder image
  - Evidence: `grep -o` dist/index.html → `Dalam tahap pilot`, `Permintaan terkirim`, `Rekaman Visit Doctor sedang berlangsung`; three `<li>` devices (Tombol panggil, Mikrofon, Layar teleprompter); no `<img>` in component (grep exit 1).
- [x] Deployment & data section: 'Instalasi terdedikasi per rumah sakit' — own server and database per hospital; no hosting brand, uptime, backup, retention, or certification promise
  - Evidence: dist/index.html contains `Instalasi terdedikasi per rumah sakit`; component grep for hosting/backup/retensi/cadangan → no match; uptime/SLA/ISO banned rules pass.
- [x] Claim check: adds a required rule for 'Dalam tahap pilot'; build + check pass
  - Evidence: red — badge text changed → `index.html: missing: hardware pilot label → (no match for /Dalam tahap pilot/)` exit 1; restored → `check-claims: OK — 1 HTML file(s), 11 banned + 11 required rules` exit 0.
