import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { content } from '../src/lib/content.mjs';
import { indexable } from '../src/lib/indexable.mjs';
import { SITE } from '../src/lib/seo.mjs';

const read = url => readFileSync(join('dist', url === '/' ? 'index.html' : `${url.slice(1)}.html`), 'utf8');
const reference = JSON.parse(readFileSync('handoff/data/seo-reference.json', 'utf8')).pages;
const decode = text => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const meta = (html,key) => decode(html.match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`))?.[1] || '');
let compared = 0;
for (const expected of reference) {
  // Hubs have their own descriptive meta; the empty blog is intentionally noindex.
  if (['/nastilki','/blog','/proekti'].includes(expected.url) || expected.url.startsWith('/blog/') || expected.url.startsWith('/proekti/')) continue;
  const html = read(expected.url);
  assert.equal(decode(html.match(/<title>([^<]*)<\/title>/)?.[1] || ''), expected.title, `Title: ${expected.url}`);
  assert.equal(meta(html,'description'), expected.description, `Description: ${expected.url}`);
  assert(html.includes(`rel="canonical" href="${expected.canonical}"`), `Canonical: ${expected.url}`);
  assert.equal(meta(html,'robots'), expected.robots, `Robots: ${expected.url}`);
  assert.equal(meta(html,'og:image'), SITE + expected.og.image, `OG image: ${expected.url}`);
  assert.equal(meta(html,'og:image:width'), '1200');
  assert.equal(meta(html,'og:image:height'), '630');
  assert.equal(meta(html,'og:image:alt'), expected.og.alt);
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || 'null');
  assert.deepEqual(ld, expected.jsonld[0], `JSON-LD: ${expected.url}`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `One H1: ${expected.url}`);
  compared++;
}
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]).sort();
assert.deepEqual(locations, indexable().map(p => SITE + p.url).sort());
assert(!sitemap.includes('/blog') && !sitemap.includes('/proekti/'));
assert(!readFileSync('dist/llms.txt','utf8').includes('/blog/'));
assert(!existsSync('dist/blog/kolko-trae.html'), 'Handoff articles must remain unpublished');
for (const p of content().pages.filter(p => p.coll === 'proekti')) assert.equal(meta(read(p.url),'robots'),'noindex, follow');
assert.equal(meta(read('/blog'),'robots'),'noindex, follow');
assert.equal(meta(read('/privacy-policy'),'robots'),'noindex, follow');
assert(read('/kontakti').includes('Изпращането предстои'));
assert(!read('/').includes('<astro-island'), 'Home content must be static HTML');
assert(!read('/tsena-nastilki').includes('€'), 'Pending prices must not be published');
const config = JSON.parse(readFileSync('vercel.json','utf8'));
assert.equal(config.cleanUrls,true);
assert.equal(config.trailingSlash,false);
for (const rule of config.redirects) {
  assert.equal(rule.statusCode,301);
  assert.notEqual(rule.source,rule.destination);
  assert(existsSync(join('dist', rule.destination === '/' ? 'index.html' : `${rule.destination.slice(1)}.html`)), `Missing redirect destination ${rule.destination}`);
}
function* htmlFiles(directory) {
  for (const entry of readdirSync(directory,{withFileTypes:true})) {
    const path = join(directory,entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}
let files = 0;
for (const path of htmlFiles('dist')) {
  const html = readFileSync(path,'utf8');
  assert(!html.includes('\ufffd') && !html.includes('\u0000'), `Corrupted Bulgarian text: ${path}`);
  assert(!html.includes('style="opacity:0'), `Hidden initial content: ${path}`);
  const isMain = !path.includes('blogove') && !path.includes('galeria');
  if (isMain) for (const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:\?[^"#]*)?(?:#[^"]*)?"/g)) {
    const url = decode(match[1]);
    if (url.startsWith('//')) continue;
    assert(existsSync(join('dist',url.slice(1))) || existsSync(join('dist',url === '/' ? 'index.html' : `${url.slice(1)}.html`)), `Broken asset or link ${url} in ${path}`);
  }
  files++;
}
console.log(`Passed: ${compared} pages match handoff meta, OG and JSON-LD; ${locations.length} sitemap URLs; ${config.redirects.length} redirects; ${files} HTML pages checked.`);
