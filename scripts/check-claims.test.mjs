import { test } from 'node:test';
import assert from 'node:assert/strict';
import { check, checkCss, extractText } from './check-claims.mjs';

// Minimal page satisfying every REQUIRED rule.
const head = `<html lang="id"><head><title>MediPrompt</title>
<meta name="description" content="d"><meta property="og:title" content="t">
<meta property="og:description" content="d"><meta property="og:image" content="/og.png"></head>`;
const body = `<a href="mailto:info.risentera@gmail.com?subject=Permintaan%20demo%20MediPrompt">Demo</a>
<p>Mitra: Politeknik Artificial Intelligence Budi Mulia Dua (PLAI BMD)</p><a href="https://plai.ac.id/">PLAI</a>
<p>Dalam tahap pilot</p><p>Saran urgensi</p><p>Hubungi kami untuk penawaran.</p>`;
const page = (extra = '', h = head) => `${h}<body>${body}${extra}</body></html>`;
const fails = (label, html) => assert.ok(check(html).some((f) => f.startsWith(label)), `expected "${label}" in ${JSON.stringify(check(html))}`);

test('clean page passes', () => assert.deepEqual(check(page()), []));
test('extractText drops comments and keeps attributes', () => {
  assert.equal(extractText('<!-- Rp --><p title="x &amp; y">a</p>').includes('Rp'), false);
  assert.match(extractText('<p title="x &amp; y">a</p>'), /x & y/);
});

const banned = [
  ['client JavaScript', '<script>1</script>'],
  ['client JavaScript', '<script type="module" src="/a.js"></script>'],
  ['third-party runtime resource', '<img srcset="/a.png 1x, https://cdn.example/a.png 2x">'],
  ['third-party runtime resource', '<embed src="//cdn.example/x.swf">'],
  ['third-party runtime resource', '<object data="https://cdn.example/x.pdf"></object>'],
  ['third-party runtime resource', '<video poster="https://cdn.example/p.jpg"></video>'],
  ['percentage', '<p>99 persen akurat</p>'],
  ['SIMRS integration claim', '<p>Terhubung langsung dengan SIMRS</p>'],
  ['SIMRS integration claim', '<p>terhubung ke SIMRS</p>'],
  ['SIMRS integration claim', '<p>Bridging SIMRS</p>'],
  ['medical-record drafting claim', '<p>rekam medis dibuat otomatis</p>'],
  ['medical-record drafting claim', '<p>Ringkasan pasien</p>'],
  ['medical-record drafting claim', '<p>draf catatan</p>'],
  ['certification/compliance claim', '<p>Rumah sakit terakreditasi</p>'],
  ['certification/compliance claim', '<p>akreditasi</p>'],
  ['uptime/SLA', '<p>Aktif 24 / 7</p>'],
  ['WhatsApp link', '<a href="whatsapp://send?phone=1">WA</a>'],
];
for (const [label, extra] of banned) test(`banned: ${label} — ${extra}`, () => fails(label, page(extra)));

test('missing og:image fails', () => fails('missing: og:image', page('', head.replace(/<meta property="og:image"[^>]*>/, ''))));

test('CSS third-party @import / url() fail, local url passes', () => {
  assert.equal(checkCss('@import "https://fonts.example/a.css";').length, 1);
  assert.equal(checkCss("@import url(//fonts.example/a.css);").length, 1);
  assert.equal(checkCss('a{background:url( "http://x.example/a.png")}').length, 1);
  assert.deepEqual(checkCss('a{background:url(/a.png)}@import "./b.css";'), []);
});
