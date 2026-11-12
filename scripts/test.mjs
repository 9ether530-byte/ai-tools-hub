// Phase 1 verification for the AI Tools Hub.
// Checks article data, then boots the production server and checks
// every page, the sitemap, RSS, the AdSense placeholder behaviour,
// and the newsletter/contact API routes (local storage only).
// Run after `npm run build`. Usage: npm test
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { ARTICLES, wordCount } from '../lib/articles.js';

const PORT = 3100;
const BASE = `http://127.0.0.1:${PORT}`;
const SUBMISSIONS = path.join(process.cwd(), 'data', 'submissions.json');

let passed = 0;
let failed = 0;
const failures = [];
function check(name, ok, detail = '') {
  if (ok) { passed++; console.log(`  PASS ${name}`); }
  else { failed++; failures.push(name); console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`); }
}
async function fetchText(p, opts) {
  const res = await fetch(`${BASE}${p}`, opts);
  return { status: res.status, text: await res.text() };
}
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function waitForServer(proc) {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.status === 200) return true;
    } catch { /* not up yet */ }
    if (proc.exitCode !== null) return false;
    await sleep(500);
  }
  return false;
}

async function main() {
  console.log('== 1. Article data ==');
  check('exactly 12 articles', ARTICLES.length === 12, `got ${ARTICLES.length}`);
  const slugs = new Set(ARTICLES.map((a) => a.slug));
  check('all slugs unique', slugs.size === ARTICLES.length);
  for (const a of ARTICLES) {
    const wc = wordCount(a);
    check(`word count 800-1200: ${a.slug}`, wc >= 800 && wc <= 1200, `${wc} words`);
    check(`related slugs valid: ${a.slug}`, a.related.every((s) => slugs.has(s)));
    check(`date/author set: ${a.slug}`, a.date === '2026-11-12' && a.author === 'NativeLayer');
  }

  console.log('== 2. Production server ==');
  // Start clean: remove prior test submissions so API checks are exact.
  if (fs.existsSync(SUBMISSIONS)) fs.unlinkSync(SUBMISSIONS);
  const env = { ...process.env };
  delete env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const proc = spawn('npx', ['next', 'start', '-p', String(PORT)], { cwd: process.cwd(), env, stdio: 'ignore' });
  try {
    const up = await waitForServer(proc);
    check('production server starts', up);
    if (!up) { console.log(`\n${passed} passed, ${failed} failed`); process.exit(1); }

    const home = await fetchText('/');
    check('home returns 200', home.status === 200, `got ${home.status}`);
    check('home has hero text', home.text.includes('Practical AI guides for small business owners'));
    check('home shows AdSense placeholder text', home.text.includes('Ad space — ads load only after AdSense approval'));
    check('no AdSense script when client ID unset', !home.text.includes('pagead2.googlesyndication.com'));
    check('no adsbygoogle script tag when client ID unset', !home.text.includes('adsbygoogle.js'));

    const list = await fetchText('/articles');
    check('/articles returns 200', list.status === 200);
    check('/articles links all 12 articles', ARTICLES.every((a) => list.text.includes(`/articles/${a.slug}`)));

    for (const a of ARTICLES) {
      const page = await fetchText(`/articles/${a.slug}`);
      check(`article page 200: ${a.slug}`, page.status === 200, `got ${page.status}`);
      check(`article page has title: ${a.slug}`, page.text.includes(a.title));
    }

    for (const p of ['/about', '/contact', '/privacy', '/disclosure']) {
      const r = await fetchText(p);
      check(`${p} returns 200`, r.status === 200, `got ${r.status}`);
    }
    const about = await fetchText('/about');
    check('about names founder + Gilmer TX', about.text.includes('Rashad Durrand Smith') && about.text.includes('Gilmer'));
    const disclosure = await fetchText('/disclosure');
    check('disclosure mentions AdSense + affiliate', disclosure.text.includes('AdSense') && disclosure.text.includes('Gumroad'));

    const sitemap = await fetchText('/sitemap.xml');
    check('sitemap returns 200', sitemap.status === 200);
    check('sitemap lists all 12 articles', ARTICLES.every((a) => sitemap.text.includes(`/articles/${a.slug}`)));

    const robots = await fetchText('/robots.txt');
    check('robots.txt returns 200', robots.status === 200);

    const rss = await fetchText('/rss.xml');
    check('rss.xml returns 200', rss.status === 200);
    check('rss lists all 12 items', (rss.text.match(/<item>/g) || []).length === 12);

    console.log('== 3. API routes (local storage) ==');
    const nl = await fetch(`${BASE}/api/newsletter`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });
    check('newsletter POST 200', nl.status === 200, `got ${nl.status}`);
    const bad = await fetch(`${BASE}/api/newsletter`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email' }),
    });
    check('newsletter rejects bad email (400)', bad.status === 400, `got ${bad.status}`);
    const ct = await fetch(`${BASE}/api/contact`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Person', email: 'test@example.com', message: 'Hello from the test script.' }),
    });
    check('contact POST 200', ct.status === 200, `got ${ct.status}`);
    const stored = JSON.parse(fs.readFileSync(SUBMISSIONS, 'utf8'));
    check('newsletter signup stored locally', stored.newsletter?.some((e) => e.email === 'test@example.com'));
    check('contact message stored locally', stored.contact?.some((e) => e.email === 'test@example.com' && e.message === 'Hello from the test script.'));
  } finally {
    proc.kill('SIGTERM');
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) { console.log('Failures:', failures.join(', ')); process.exit(1); }
}

main().catch((err) => { console.error(err); process.exit(1); });
