// Claim check: scans dist/**/*.html after `astro build`.
// BANNED runs on visible text + attribute values (alt/title/content/aria-label/href/src),
// with <style>/<script> bodies removed. Entries with `raw: true` run on the raw HTML instead.
// CSS_BANNED runs on dist/**/*.css. REQUIRED runs on the raw HTML. Later tickets append one entry each.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

export const BANNED = [
  { label: 'price / Rp', pattern: /\bRp\.?\s?\d[\d.,]*|\bRp\b|\bIDR\b|rupiah/i },
  { label: 'SIMRS integration claim', pattern: /(ter)?integrasi\s+(dengan\s+|ke\s+)?SIMRS|SIMRS[\s-]+(ter)?integrasi|integrated with SIMRS|terhubung\s+(langsung\s+)?(dengan|ke)\s+SIMRS|bridging\s+SIMRS/i },
  { label: 'medical-record drafting claim', pattern: /rekam\s+medis\s+otomatis|draf(t)?\s+rekam\s+medis|rekam\s+medis[^.]{0,30}otomatis|ringkasan|\bdraf\b/i },
  { label: 'percentage (accuracy/uptime/statistic)', pattern: /\d+(?:[.,]\d+)?\s?%|\d+\s*persen/i },
  { label: 'certification/compliance claim', pattern: /tersertifikasi|bersertifikat|\bISO\b|Kemenkes|HIPAA|SATU\s?SEHAT|terakreditasi|akreditasi/i },
  { label: 'AI diagnosis / clinical triage', pattern: /diagnos(is|a)|triase\s+klinis/i },
  { label: 'uptime/SLA', pattern: /\buptime\b|\bSLA\b|24\s*\/\s*7/i },
  { label: 'testimonial', pattern: /testimoni/i },
  { label: 'WhatsApp link', pattern: /wa\.me\/|whatsapp\.com|whatsapp:/i },
  { label: 'analytics/cookies', pattern: /gtag\(|googletagmanager|google-analytics|document\.cookie|plausible\.io|umami/i, raw: true },
  { label: 'third-party runtime resource', pattern: /<(?:script|link|img|iframe|source|video|audio|embed|object)\b[^>]*\b(?:src|href|srcset|data|poster)=["']?(?:[^"'>]*[\s,])?(?:https?:)?\/\/[^"'\s>]+/i, raw: true },
  { label: 'client JavaScript', pattern: /<script\b/i, raw: true },
];

export const CSS_BANNED = [
  { label: 'third-party CSS resource', pattern: /@import\s+(?:url\(\s*)?["']?(?:https?:)?\/\/[^"'\s);]+|url\(\s*["']?(?:https?:)?\/\/[^"'\s)]+/i },
];

export const REQUIRED = [
  { label: 'html lang="id"', pattern: /<html\b[^>]*\blang=["']?id["'\s>]/i },
  { label: '<title>', pattern: /<title>[^<]*\S[^<]*<\/title>/i },
  { label: 'meta description', pattern: /<meta\b[^>]*name=["']?description["']?[^>]*content=["'][^"']+["']/i },
  { label: 'og:title', pattern: /<meta\b[^>]*property=["']?og:title["']?[^>]*content=["'][^"']+["']/i },
  { label: 'og:image', pattern: /<meta\b[^>]*property=["']?og:image["']?[^>]*content=["'][^"']+["']/i },
  { label: 'og:description', pattern: /<meta\b[^>]*property=["']?og:description["']?[^>]*content=["'][^"']+["']/i },
  { label: 'mailto pilot demo link', pattern: /href=["']?mailto:info\.risentera@gmail\.com\?subject=Permintaan%20demo%20MediPrompt/i },
  { label: 'PLAI BMD credit', pattern: /Mitra:[\s\S]{0,200}Politeknik Artificial Intelligence Budi Mulia Dua \(PLAI BMD\)/ },
  { label: 'PLAI BMD link', pattern: /href=["']?https:\/\/plai\.ac\.id\/?["'\s>]/i },
  { label: 'hardware pilot label', pattern: /Dalam tahap pilot/ },
  { label: 'advisory urgency label', pattern: /saran urgensi/i },
  { label: 'quotation line', pattern: /Hubungi kami untuk penawaran/ },
];

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };
const decode = (s) => s.replace(/&(#\d+|#x[0-9a-f]+|\w+);/gi, (m, e) =>
  ENTITIES[e.toLowerCase()] ?? (e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : +e.slice(1)) : m));

// Visible text plus attribute values a claim could hide in.
export function extractText(html) {
  const body = html.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(style|script)\b[\s\S]*?<\/\1>/gi, ' ');
  const attrs = [];
  body.replace(/\b(alt|title|content|aria-label|href|src|placeholder)=("([^"]*)"|'([^']*)'|([^\s>]+))/gi,
    (_, _n, _v, a, b, c) => attrs.push(a ?? b ?? c));
  const text = body.replace(/<[^>]+>/g, ' ');
  return decode(`${text}\n${attrs.join('\n')}`).replace(/\s+/g, ' ');
}

export function check(html) {
  const text = extractText(html);
  const failures = [];
  for (const { label, pattern, raw } of BANNED) {
    const m = (raw ? html : text).match(pattern);
    if (m) failures.push(`${label} → ${m[0].trim()}`);
  }
  for (const { label, pattern } of REQUIRED) {
    if (!pattern.test(html)) failures.push(`missing: ${label} → (no match for ${pattern})`);
  }
  return failures;
}

export function checkCss(css) {
  return CSS_BANNED.flatMap(({ label, pattern }) => { const m = css.match(pattern); return m ? [`${label} → ${m[0].trim()}`] : []; });
}

const walk = (dir, ext) => readdirSync(dir, { withFileTypes: true })
  .flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name), ext) : d.name.endsWith(ext) ? [join(dir, d.name)] : []));

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dist = fileURLToPath(new URL('../dist/', import.meta.url));
  let files, cssFiles;
  try { files = walk(dist, '.html'); cssFiles = walk(dist, '.css'); } catch { console.error('check-claims: dist/ not found — run astro build first'); process.exit(1); }
  if (!files.length) { console.error('check-claims: no HTML files in dist/'); process.exit(1); }
  const lines = [
    ...files.flatMap((f) => check(readFileSync(f, 'utf8')).map((l) => `${relative(dist, f)}: ${l}`)),
    ...cssFiles.flatMap((f) => checkCss(readFileSync(f, 'utf8')).map((l) => `${relative(dist, f)}: ${l}`)),
  ];
  if (lines.length) { console.error(lines.join('\n')); process.exit(1); }
  console.log(`check-claims: OK — ${files.length} HTML + ${cssFiles.length} CSS file(s), ${BANNED.length} banned + ${CSS_BANNED.length} CSS + ${REQUIRED.length} required rules`);
}
