# Spec: MediPrompt landing page

Status: ready-for-agent (local; no issue tracker configured for `mediprompt-site` yet).
Glossary: `CONTEXT.md` in this repo. Product facts: the sibling `mediprompt` checkout (read-only) — `server/CONTEXT.md`, `server/docs/design/calls-v2.md`, `server/docs/adr/0009-*`, `0011-*`–`0013-*`, `server/docs/api/calls-v2.md`, `server/docs/api/devices.md`, and the client branding assets.

## Problem Statement

Hospitals in Indonesia that already run a SIMRS have no public page that explains what MediPrompt does, how a patient's call reaches a nurse, and how to arrange a pilot. The only public mention today is on the Partner's (PLAI BMD) website, and it describes capabilities — automatic medical-record drafts, SIMRS integration — that are not published capabilities. A hospital decision-maker therefore cannot learn what the product actually does, or whom to contact.

## Solution

A single-page, Bahasa Indonesia, static marketing site for MediPrompt, published by Risentera with PLAI BMD credited as Partner. It positions MediPrompt as nurse-call and clinical communication that works alongside the hospital's SIMRS, explains the voice assistance flow and Visit Doctor transcription using only published capabilities, presents the bedside devices as being in pilot, and ends in a pilot demo request via email. It shows no prices, uses no analytics or cookies, and builds to plain static files deployable to any static host.

## User Stories

1. As a hospital director, I want to understand in one sentence what MediPrompt is, so that I can decide whether to read further.
2. As a hospital director, I want to see that MediPrompt works alongside our existing SIMRS, so that I know it does not ask us to replace it.
3. As an IT head, I want the site to avoid claiming SIMRS integration, so that I am not misled about integration work.
4. As a head nurse, I want to see the problem MediPrompt addresses (patient calls that are missed, unclear, or not owned by anyone), so that I recognise my ward's situation.
5. As a head nurse, I want to see how a patient's button press becomes a request in the monitoring center, so that I understand the flow.
6. As a head nurse, I want to know that a request reaches the monitoring center even when the patient says nothing or speech cannot be understood, so that I trust no call is silently dropped.
7. As a nurse, I want to see that one nurse claims a request and becomes responsible for it, so that two nurses do not run to the same room while another room waits.
8. As a head nurse, I want to see that unclaimed requests escalate to head nurses after a deadline, so that requests are not left unanswered.
9. As a head nurse, I want the AI urgency suggestion clearly labelled as advisory, overridable by the nurse, so that I know clinical judgement stays with staff.
10. As a head nurse, I want to see that a nurse's own urgency assessment takes precedence over the suggestion, so that the queue reflects clinical judgement.
11. As a head nurse, I want to see that requests are only visible to the nurses assigned to that room and authorised head nurses, so that I understand who sees what.
12. As a doctor, I want to see that a Visit Doctor session records the conversation and produces a transcript, so that I understand what the transcription feature does.
13. As a doctor, I want the site to call the result a transcript rather than a medical record or summary, so that I am not promised a drafted record.
14. As a ward manager, I want to see that the room's microphone can record a Visit Doctor session, so that I understand the role of the bedside devices.
15. As a procurement officer, I want to see which bedside devices make up a room (call button, microphone, teleprompter screen), so that I can picture the installation.
16. As a procurement officer, I want the bedside devices clearly labelled "Dalam tahap pilot", so that I do not mistake them for an off-the-shelf product with specifications.
17. As a patient's family member reading the site, I want to see what the teleprompter screen shows the patient (request sent, Visit Doctor recording in progress), so that I understand what the patient experiences.
18. As an IT head, I want to see that each hospital gets a dedicated installation with its own server and database, so that I know our data is not shared with other hospitals.
19. As an IT head, I want the site to make no uptime, backup, certification, or compliance promise, so that the contract is the only place such terms are set.
20. As a hospital director, I want an obvious way to request a pilot demo, so that I can start a conversation with Risentera.
21. As a hospital director, I want pricing questions answered with an invitation to ask for a quotation, so that I know how to get a price.
22. As a visitor, I want to see that Risentera publishes MediPrompt and PLAI BMD is its partner, so that I know who stands behind it.
23. As a visitor, I want a FAQ answering the obvious objections (does it replace our SIMRS, is the AI a diagnosis, what hardware is needed, where is data stored, what does it cost), so that I do not need to email for basics.
24. As a visitor on a phone, I want the page to read well on a small screen, so that I can review it between rounds.
25. As a visitor using a screen reader or keyboard, I want proper headings, alt text, link text and focus states, so that the page is accessible.
26. As a visitor, I want the page to load without tracking scripts or cookie banners, so that my visit is private and fast.
27. As someone sharing the link in WhatsApp, I want a proper title, description and preview image, so that the link preview is meaningful.
28. As the Risentera owner, I want the site built as static files with no server, so that I can host it anywhere once the domain is chosen.
29. As the Risentera owner, I want a build-time check that fails when banned claims or a price appear in the output, so that later copy edits cannot reintroduce unsupported claims.
30. As the Risentera owner, I want to add a WhatsApp number, a domain, a hardware photo and the PLAI BMD logo later without restructuring the page, so that deferred material drops into existing slots.

## Implementation Decisions

**Stack and output**
- Astro, static output only (`astro build`), no UI framework integration, no client-side JavaScript beyond what Astro emits by default (none expected). Plain CSS; no Tailwind, no MUI.
  - Lazier alternative noted during grilling: a single hand-written `index.html` + CSS. Astro was chosen; keep it to one page and one layout.
- No analytics, cookies, fonts from third-party CDNs, or external requests at runtime. Fonts: system font stack, or one self-hosted font file if the design needs it.
- Hosting target undecided: output must work from any static host and from a subpath-free root. Domain undecided: no `site` value is invented; canonical and Open Graph URLs stay relative/omitted until a domain is supplied. Add the domain in one config value when known.

**Language and brand**
- All visible copy in Bahasa Indonesia; `lang="id"`.
- Product name is always "MediPrompt" (see glossary `_Avoid_` list).
- Brand assets copied from the sibling `mediprompt` client: the MediPrompt logo and the teal brand colour `#0F766E` (theme colour in the app manifest), with the navy of the wordmark as the text/heading colour. The Sintesa logo used inside the app is **not** used on the site.
- PLAI BMD is credited as text ("Mitra: Politeknik Artificial Intelligence Budi Mulia Dua (PLAI BMD)") linking to https://plai.ac.id/. Its logo is not copied from its website; a logo slot is used only when the logo is supplied with permission.

**Page sections (in order)**
1. *Hero* — headline positioning MediPrompt as nurse-call and clinical communication that works alongside the hospital's SIMRS; one primary action (pilot demo request, email) and one secondary (scroll to the flow). Visual: inline SVG/CSS mock of the monitoring center queue.
2. *Masalah (Problem)* — calls that are missed, unclear, or owned by nobody; no statistics (none are sourced).
3. *Alur permintaan (How a request flows)* — steps grounded in the calls v2 design: button press → request persisted and shown in the monitoring center immediately (even with no speech) → optional spoken message → advisory urgency suggestion arrives → one nurse claims it → nurse may set their own urgency, which takes precedence → nurse resolves. Mention escalation of unclaimed requests to head nurses, without naming the 60 s operational default as a guarantee. Mention room-scoped visibility. AI urgency is always labelled "saran (advisory)", never "diagnosis" or "triase klinis".
4. *Visit Doctor* — a session records the doctor–patient conversation, a transcript is produced by speech recognition and attached to the session; may be started by staff or by the room's microphone. Called "transkrip", never "rekam medis", "ringkasan", or "draf". No accuracy claim.
5. *Perangkat di kamar (Hardware)* — labelled "Dalam tahap pilot". Three separate bedside devices: call button, microphone, teleprompter screen; connected to the nurse dashboard. The teleprompter screen shows: request sent confirmation; Visit Doctor recording in progress. No specifications, no photo until supplied (an explicit empty slot in the layout is not rendered as a placeholder image).
6. *Instalasi & data (Deployment & data)* — "Instalasi terdedikasi per rumah sakit": each hospital gets its own server and database. No hosting brand, no uptime, backup, retention, or certification promise.
7. *Ajukan pilot (Pilot CTA)* — email link `mailto:info.risentera@gmail.com` with a prefilled subject (e.g. "Permintaan demo MediPrompt"). Pricing line: "Hubungi kami untuk penawaran." WhatsApp link omitted until a number is supplied.
8. *FAQ* — native `<details>/<summary>` (no JS). Questions: replaces SIMRS? (no, works alongside); is the AI a diagnosis? (no, advisory, nurse decides); what hardware is needed? (bedside devices, in pilot); where is data stored? (dedicated installation per hospital); what does it cost? (ask for a quotation); is it integrated with SIMRS? (not claimed — discuss during the pilot).
9. *Footer* — "© Risentera", Partner credit, contact email. No legal pages (none supplied).

**Claim policy (enforced)**
- Only published capabilities. The following must not appear in the built output: any price or "Rp"; "terintegrasi dengan SIMRS"/"integrasi SIMRS" as a claim; "rekam medis otomatis", "draf rekam medis"; accuracy percentages; "tersertifikasi", "ISO", "Kemenkes", "HIPAA", "SATUSEHAT" as claims; "diagnosis" applied to the AI; uptime/SLA numbers; testimonials or customer logos.
- Mock screens use clearly fictional, non-identifying sample data (e.g. "Kamar 204", no real patient names) and contain no statistics presented as real.

**Explicit scope rule from combined answers (check this)**
- "Only capabilities present in code" + "the hardware is a prototype" ⇒ hardware behaviour may be described only where the server supports it (device-originated assistance requests, device-bound Visit Doctor sessions, the device's own active-request read), and the whole hardware section carries the pilot label.
- Consequence: **"free-text prompts/instructions from staff"** on the teleprompter screen has no API in the server (no staff-to-device message contract exists). Decided: it is left off the site. Revisit only when a staff-to-device contract exists.

## Testing Decisions

- One seam: the **built static output**. Tests inspect `dist/` HTML, never Astro component internals.
- Check 1 — `astro build` exits 0.
- Check 2 — a small claim-check script (Node stdlib only, run after build as part of the build/check npm script) that fails when any banned term from the claim policy appears in `dist/**/*.html`, and when required content is missing: `lang="id"`, the `mailto:info.risentera@gmail.com` link, the "Dalam tahap pilot" label, the advisory label next to AI urgency, the PLAI BMD credit, a `<title>` and `og:title`/`og:description`. Each rule failing prints the file and the matched term. It must have been seen to fail once (e.g. by temporarily adding "Rp") before being trusted.
- Check 3 — manual browser check at 375 px and 1280 px widths: no horizontal scroll, FAQ toggles with keyboard, visible focus rings, images have alt text. Screenshots kept as evidence.
- Prior art: none in this repo (empty). The sibling client uses Vitest, which is not needed for a static page; no test framework is added.

## Out of Scope

- Pricing, plans, or the Rp pilot offer from the HPP estimate.
- Testimonials, customer logos, case studies, statistics.
- WhatsApp link (until a number is supplied), domain/canonical URL, hosting configuration, CI/deploy pipeline.
- Hardware photos and specifications; PLAI BMD logo (until supplied with permission).
- Contact form, backend, newsletter, analytics, cookie banner.
- English version or language toggle.
- Blog, multiple pages, privacy policy/terms pages (none supplied).
- Any change to the `mediprompt` product repos.

## Further Notes

- **Conflict with the Partner's public copy:** plai.ac.id describes MediPrompt as an AI system that automatically drafts medical records from doctor–patient conversations, integrated into hospital SIMRS. This spec, per the agreed positioning and claim policy, says neither. Decided: this site keeps its wording; the owner asks PLAI BMD to update their description (an owner action outside this repo, not a ticket).
- **External prerequisites before publishing (not before coding):** domain; hosting target; optional WhatsApp number; optional hardware photo; optional PLAI BMD logo with permission; owner review of final Indonesian copy.
- **Review round 1 decisions (owner):** apply all eight review fixes (claim check fails properly on any path; ban local scripts and scan CSS; ban Indonesian rewordings plus "ringkasan"/"draf"; one term each — dasbor, basis data, tagihan; no ticket comments in the HTML; Kamar 112 example shows no "Saran AI" without a voice message; one mailto definition; FAQ +/− marker hidden from screen readers). Keep "Tekan tombol sekali lagi untuk berhenti merekam" (the product design says a second press stops recording). Add a 1200×630 Open Graph image of the MediPrompt logo on teal. The hero stays text-only; the queue mock stays in the flow section.
- The sibling `mediprompt` checkout has no root git repo; product facts were read from its working tree on 2026-11-21.
- Suggested ticket breakdown (for `/to-tickets`): (1) Astro scaffold + layout + brand tokens + claim-check script; (2) Hero, Problem, Flow sections with SVG queue mock; (3) Visit Doctor + Hardware + Deployment sections; (4) CTA, FAQ, footer, meta/OG; (5) responsive/a11y pass with screenshots.
